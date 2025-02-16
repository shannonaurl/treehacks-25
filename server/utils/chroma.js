const { ChromaClient } = require('chromadb');

const chroma = new ChromaClient({
    path: "https://api.trychroma.com:8000",
    auth: { provider: "token", credentials: process.env.CHROMA_TOKEN, tokenHeaderType: "X_CHROMA_TOKEN" },
    tenant: process.env.CHROMA_TENANT,
    database: 'treehacks-25'
});

module.exports = chroma;
