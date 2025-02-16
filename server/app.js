const express = require("express");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello from booksy!");
});

const supabase = require("./utils/supabase");
const axios = require("axios");

app.get("/login", async (req, res) => {
    const { email, name } = req.query;

    const { data, error } = await supabase.from("users").insert({ email: email, name: name }).select();

    if (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Failed to add user" });
    }

    res.json({ message: "User added successfully" });
});

// new creates a Page instance (with groq, lumalabs, elevenlabs)
// Page instance has metadata (book-uuid)
app.get("/new", async (req, res) => {
    const { genre } = req.query;

    const email = "abc@xyz.com";

    // generate story
    const groqPrompt = `Tell me a ${genre} story!`;
    console.log(`${req.protocol}://${req.get("host")}/api/story?prompt=${encodeURIComponent(groqPrompt)}`);
    const groqResponse = await axios.get(`${req.protocol}://${req.get("host")}/api/story?prompt=${encodeURIComponent(groqPrompt)}`);
    let groqJson = await groqResponse.data.choices[0].message.content;
    let context = await groqResponse.data.codingContext;
    groqJson = JSON.parse(groqJson);
    console.log(groqJson);
    // console.log("context", context);

    // TODO on api.js: prompt engineer to make it into a 2 person narration and randomly ask user for next input

    try {
        // parallel process image and voiceover
        const [lumaResponse, elevenResponse] = await Promise.all([
            axios.get(`${req.protocol}://${req.get("host")}/api/image?prompt=${encodeURIComponent(groqJson.story)}`),
            axios.get(`${req.protocol}://${req.get("host")}/api/voice?text=${encodeURIComponent(groqJson.story)}`),
        ]);

        const lumaJson = await lumaResponse.data.url;
        const elevenJson = await elevenResponse.data.url;

        const bookId = `book-${uuidv4()}`;
        const pages = [];
        pages.push({
            text: groqJson.story,
            image_url: lumaJson,
            voice_url: elevenJson,
            pause_for_input: groqJson.pause_for_input,
        });

        // push to supabase
        const { data, error } = await supabase.from("pages").insert({
            book_id: bookId,
            text: groqJson.story,
            image_url: lumaJson,
            voice_url: elevenJson,
            title: groqJson.title,
            user_id: email,
            context: context,
            pages: pages,
            genre: genre,
        });

        if (error) {
            console.error("Error adding page:", error);
            return res.status(500).json({ error: "Failed to add page" });
        }

        return res.json({
            story: groqJson.story,
            pause_for_input: groqJson.pause_for_input,
            book_id: bookId,
            image: lumaJson,
            voice: elevenJson,
            title: groqJson.title,
            message: "Page generated successfully",
        });
    } catch (error) {
        console.error("Error generating page:", error);
        return res.status(500).json({ error: "Failed to generate page" });
    }
});

app.get("/next", async (req, res) => {
    const { book_id, prompt } = req.query;

    const email = "abc@xyz.com";
    console.log("book_id", book_id);

    // get past context from supabase
    const { data: pagesData, error } = await supabase.from("pages").select().eq("book_id", book_id);
    if (error) {
        console.error("Error fetching pages:", error);
        return res.status(500).json({ error: "Failed to fetch pages" });
    }

    console.log(pagesData);
    const pastContext = pagesData[0].context;
    // console.log("past-context", pastContext);
    const pages = pagesData[0].pages;
    const groqResponse = await axios.get(`${req.protocol}://${req.get("host")}/api/story?prompt=${prompt}&context=${JSON.stringify(pastContext)}`);
    let groqJson = await groqResponse.data.choices[0].message.content;
    let context = await groqResponse.data.codingContext;
    groqJson = JSON.parse(groqJson);

    console.log(groqJson);
    console.log("new-context", context);

    try {
        // parallel process image and voiceover
        const [lumaResponse, elevenResponse] = await Promise.all([
            axios.get(`${req.protocol}://${req.get("host")}/api/image?prompt=${encodeURIComponent(groqJson.story)}`),
            axios.get(`${req.protocol}://${req.get("host")}/api/voice?text=${encodeURIComponent(groqJson.story)}`),
        ]);

        const lumaJson = await lumaResponse.data.url;
        console.log(lumaJson);
        const elevenJson = await elevenResponse.data.url;
        console.log(elevenJson);

        const newPages = [
            ...pages,
            {
                text: groqJson.story,
                image_url: lumaJson,
                voice_url: elevenJson,
                pause_for_input: groqJson.pause_for_input,
            },
        ];

        // update supabase
        const { data, error } = await supabase
            .from("pages")
            .update({
                context: context,
                pages: newPages,
            })
            .eq("book_id", book_id);
        // const { data, error } = await supabase.from("pages").insert({
        //     book_id: book_id,
        //     text: groqJson.story,
        //     image_url: lumaJson,
        //     voice_url: elevenJson,
        //     context: context,
        // });

        if (error) {
            console.error("Error adding page:", error);
            return res.status(500).json({ error: "Failed to add page" });
        }

        return res.json({
            story: groqJson.story,
            pause_for_input: groqJson.pause_for_input,
            book_id: book_id,
            image: lumaJson,
            voice: elevenJson,
            message: "Page generated successfully",
        });
    } catch (error) {
        console.error("Error generating page:", error);
        return res.status(500).json({ error: "Failed to generate page" });
    }
});

app.get("/share", async (req, res) => {
    const { book_id } = req.query;
    const { data, error } = await supabase.from("pages").select("title, pages").eq("book_id", book_id);

    return res.status(200).json(data);
});

app.get("/all-books", async (req, res) => {
    const { data, error } = await supabase.from("pages").select("title, genre").in("genre", ["adventure", "fantasy", "mystery"]);

    return res.status(200).json(data);
});

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
});
