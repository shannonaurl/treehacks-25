require('dotenv').config();
const { createWriteStream, readFileSync, unlink } = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = require('express').Router();
const Groq = require('groq-sdk');
const { ElevenLabsClient, play } = require('elevenlabs');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const supabase = createSupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
router.get('/story', async (req, res) => {
    const { genre } = req.query;
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "system", // system prompt
                content: `You are the world’s best bedtime story narrator for children aged 5-8. Your storytelling is warm, engaging, and filled with wonder. You create magical, age-appropriate tales that spark imagination and curiosity while maintaining a gentle, soothing tone perfect for bedtime.

Every story you generate follows the genre provided by the user, such as adventure, fantasy, or mystery. The story always features two main characters: a parent and their child, embarking on a heartwarming journey together. You craft vivid descriptions, engaging dialogue, and simple yet captivating plots that promote positive messages of love, courage, and curiosity.

Your sentences are short and easy to understand for the defined age bracket of children. Your stories use a calming narrative style, with rhythmic language and gentle pacing to guide young listeners into a peaceful sleep. Your goal is to make every story a cozy adventure that strengthens the bond between parent and child while creating a magical storytelling experience.`,
            },
            {
                role: "assistant", // prefilling prompt to maintain consistency and skip unnecessary introductions
                content: "Please provide a genre for the bedtime story you would like me to generate.",
            },
            {
                role: "user", // user prompt
                content: genre,
            }
        ],

        model: "llama3-70b-8192",

        temperature: 0.5,
        max_completion_tokens: 500,
        top_p: 1,
        stop: null,
        stream: false,
    });

    return res.json(response);
});

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
router.get("/voice", async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({ error: "Text query parameter is required" });
        }

        const audio = await client.textToSpeech.convert("RLZSZodi7ECE8WCeD9Pp", {
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
                const { data, error } = await supabase.storage.from("narrator-audio-files").upload(fileName, fileBuffer, {contentType: "audio/mpeg"});
                unlink(fileName, () => console.log("Deleted audio file"));

                if (error) {
                    console.error("Error uploading audio file:", error);
                    return res.status(500).json({ error: "Failed to upload audio file" });
                }

                return res.json({ url: data.fullPath });
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

module.exports = router;
