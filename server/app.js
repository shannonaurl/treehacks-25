const express = require('express');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const chroma = require('./utils/chroma');
const supabase = require('./utils/supabase');
const axios = require('axios');

app.get('/login', async (req, res) => {
    const { email, name } = req.query;

    const { data, error } = await supabase.from('users').insert({ email: email, name: name }).select();

    if (error) {
        console.error('Error adding user:', error);
        return res.status(500).json({ error: 'Failed to add user' });
    }

    res.json({ message: 'User added successfully' });
});

// new creates a Page instance (with groq, lumalabs, elevenlabs)
// Page instance has metadata (book-uuid)
app.get('/new', async (req, res) => {
    const { genre, email } = req.query;

    // generate story
    const groqPrompt = `Tell me a ${genre} story!`;
    console.log(`${req.protocol}://${req.get('host')}/api/story?prompt=${encodeURIComponent(groqPrompt)}`);
    const groqResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/story?prompt=${encodeURIComponent(groqPrompt)}`);
    const groqJson = await groqResponse.data.choices[0].message.content;
    console.log(groqJson);

    try {
        const [lumaResponse, elevenResponse] = await Promise.all([
            axios.get(`${req.protocol}://${req.get('host')}/api/image?prompt=${encodeURIComponent(groqJson)}`),
            axios.get(`${req.protocol}://${req.get('host')}/api/voice?text=${encodeURIComponent(groqJson)}`),
        ]);

        const lumaJson = await lumaResponse.data.url;
        const elevenJson = await elevenResponse.data.url;

        // push to supabase
        const { data, error } = await supabase.from('pages').insert({
            book_id: `book-${uuidv4()}`,
            text: groqJson,
            image_url: lumaJson,
            voice_url: elevenJson,
            user_id: email,
        })

        if (error) {
            console.error('Error adding page:', error);
            return res.status(500).json({ error: 'Failed to add page' });
        }

        return res.json({
            story: groqJson,
            image: lumaJson,
            voice: elevenJson,
            message: 'Page generated successfully',
        });
    } catch (error) {
        console.error('Error generating page:', error);
        return res.status(500).json({ error: 'Failed to generate page' });
    }
});

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, err => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
});
