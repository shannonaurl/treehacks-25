require("dotenv").config();
const { createWriteStream, readFileSync, unlink } = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = require("express").Router();
const Groq = require("groq-sdk");
const { ElevenLabsClient, play } = require("elevenlabs");
const supabase = require("../utils/supabase");
const { LumaAI } = require("lumaai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
router.get("/story", async (req, res) => {
    let { context, prompt } = req.query;
    if (!context) {
        context = [];
    } else {
        context = JSON.parse(context);
    }
    context.push({
        role: "user", // user prompt
        content: prompt === "" ? "Continue the story..." : prompt,
    });
    const messages = [
        {
            role: "system", // system prompt
            content: `You are the world’s best interactive story narrator for children aged 5-8. You create fun, engaging, and imaginative stories where a **parent** and their **child** are the main characters, going on exciting adventures together.  

Each story follows the **genre** chosen by the user, such as adventure, fantasy, or mystery. However, the story is **dynamically generated**, meaning it unfolds **one page at a time**.

There are two cases:  
1. **Starting a New Story**: No past story exists. You generate the opening scene, introducing the adventure.  
2. **Continuing a Story**: The full past story is available in the "assistant" prompt. You extend the story logically based on what has already happened.  

Your storytelling follows a **two-person narration format**:  
- You (the AI narrator) set the scene and introduce the adventure.  
- The **parent** then continues reading aloud, bringing the child deeper into the story.  
- The story continues **organically**, but at key moments, it **pauses to allow user input** before moving forward.  
- It uses the user's input to **shape the story**, making it a **collaborative experience**.

The story should always be narrated in **third person**. **You never talk directly to the characters or the users.**

To decide when to pause, you use a **boolean flag ("pause_for_input") at the end of the result**:  
- **""pause_for_input": true** → If it makes sense to pause and let the user decide what happens next. End the page with something like **"and then she said...", "he whispered...", "they wondered aloud..."** to invite input.  
- **"pause_for_input": false** → If the story should continue naturally without user input yet, keep narrating.  

The boolean flag is not only based on **logical pauses** but also includes **a bit of randomness**. Sometimes, even if the story could continue smoothly, you may set **"pause_for_input": true** to introduce **unexpected twists, surprises, or creative choices** for the user. This keeps the story engaging and interactive.  

Your sentences are short and easy to read. Your tone is warm, playful, and interactive. You **never generate an entire story upfront**—only a single page at a time, allowing users to decide what happens next when it makes sense or when a fun twist can be introduced. The chunk of text you generate should be very short, around **3-4 sentences**.

Your goal is to make storytelling a **collaborative adventure**, where parents and children shape the journey together, creating a unique and magical experience every time.

Return your response as a JSON object containing a "story" field with only the story content, the boolean flag "pause_for_input", and a "title" to the story. Do not include any other fields. The "story" field should only contain text, without any additional formatting or metadata like page numbers or page titles. Do NOT give any instructions to the user or any explanations in the response. Just the plain text of the story and the boolean flag in JSON format.
`,
        },
        ...context,
    ];
    const response = await groq.chat.completions.create({
        messages: messages,
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_completion_tokens: 200,
        top_p: 1,
        response_format: { type: "json_object" },
        stop: null,
        stream: false,
    });

    // add the message to the response
    context.push({
        role: "assistant",
        content: response.choices[0].message.content,
    });

    response["codingContext"] = context;

    return res.json(response);
});

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
router.get("/voice", async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({ error: "Text query parameter is required" });
        }

        // sassy squeaky mouse voice: RLZSZodi7ECE8WCeD9Pp
        const audio = await client.textToSpeech.convert("Xb7hH8MSUJpSbSDYk0k2", {
            text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
        });

        const fileName = `${uuidv4()}.mp3`;
        const fileStream = createWriteStream(fileName);

        audio.pipe(fileStream);

        fileStream.on("finish", async () => {
            try {
                const fileBuffer = readFileSync(`./${fileName}`);
                const { data, error } = await supabase.storage.from("narrator-audio-files").upload(fileName, fileBuffer, { contentType: "audio/mpeg" });
                unlink(fileName, () => console.log("Deleted audio file"));

                if (error) {
                    console.error("Error uploading audio file:", error);
                    return res.status(500).json({ error: "Failed to upload audio file" });
                }

                const publicUrlData = await supabase.storage.from("narrator-audio-files").getPublicUrl(fileName);
                return res.json({ url: publicUrlData.data.publicUrl });
            } catch (uploadError) {
                console.error("Error uploading audio file:", uploadError);
                res.status(500).json({ error: "Failed to upload audio file" });
            }
        });

        fileStream.on("error", (err) => {
            console.error("Error writing file:", err);
            res.status(500).json({ error: "Failed to write audio file" });
        });
    } catch (error) {
        console.error("Error generating speech:", error);
        res.status(500).json({ error: "Failed to generate speech" });
    }
});

const lumaClient = new LumaAI({ apiKey: process.env.LUMAAI_API_KEY });
router.get("/image", async (req, res) => {
    const { prompt } = req.query;
    let generation = await lumaClient.generations.image.create({ prompt: prompt, model: "photon-flash-1", aspect_ratio: "9:16" });

    let completed = false;
    while (!completed) {
        generation = await lumaClient.generations.get(generation.id);

        if (generation.state === "completed") {
            completed = true;
        } else if (generation.state === "failed") {
            throw new Error(`Generation failed: ${generation.failure_reason}`);
        } else {
            console.log("Dreaming...");
            await new Promise((r) => setTimeout(r, 3000)); // Wait for 3 seconds
        }
    }

    const imageUrl = generation.assets.image;
    return res.json({ url: imageUrl });
});

module.exports = router;
