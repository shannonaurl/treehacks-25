require('dotenv').config();

const router = require('express').Router();
const Groq = require('groq-sdk');

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

module.exports = router;
