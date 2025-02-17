## Inspiration 💡

**40–60% of parents feel they don’t spend enough time with their children**, and the average family manages **just 6 precious hours** together each week.

This isn’t just a statistic: it’s a **missed opportunity for connection, learning, and shared joy.** Research shows that meaningful parent-child interactions foster crucial parts of child development, including **emotional development, academic success, and long-term well-being**. Yet, between work, school, and digital distractions, family time often slips through the cracks.

We believe that storytelling is one of the most powerful ways to bond across generations. _How could we help families turn limited time together into collaborative, creative storytelling experiences?_

That’s why we created **booksy** - an **AI-powered storytelling platform** that allows families to **co-create interactive storybooks** together, blending AI-generated narratives, illustrations, and personal video recordings. 


## What it does 📖

Introducing **booksy**: _Stories built together, memories cherished forever._ booksy redefines family storytelling by combining AI-powered story generation, interactive decision-making, and multimedia preservation.

booksy integrates three different forms of media **real-time**: text, image, and voice, transforming it into an interactive, real-time storytelling experience.

(the demo video in this submission has been sped up to be under the time limit.)

Families can:

📚 **Create personalized storybooks** – Choose a genre and co-create with your loved ones and AI to generate unique children’s stories that are illustrated, narrated, and generated in real-time.

🎭 **Shape the narrative together** – Engage in a choose-your-own-adventure format where parents and children make decisions that influence the storyline.

📰 **Relive the magic** – Experience an AI-narrated playback that combines the story, illustrations, and family-recorded audios into a unique digital time capsule.

booksy isn’t just about reading stories – it’s about creating them together, making **storytelling a shared experience** that brings families closer together.

## How we built it 🛠️
booksy is built with **handcrafted design and AI** to create an intuitive, immersive, and magical storytelling experience.

**Design Approach**
Every aspect of booksy, from assets and animations to UI elements and backgrounds, was **designed from scratch**. We started with sketching user flows to ensure a seamless user experience, and then developed our vector-based art using Figma and Linearity.

We focused on three key design principles:

🎨 **Creativity**: Making the platform visually engaging and fun for children.

🧩 **Accessibility** – Crafting a simple, child-friendly UI that is intuitive and easy to navigate.

🚀 **Immersion** – Bringing booksy to life with an interactive, personality-driven mascot and fluid transitions that make storytelling feel magical.

**Technical Implementation**
booksy is a single-page web app, built with React and powered by a Node.js server. Some key parts of our technical implementation include:

📖 **AI-Powered Storytelling** – We leverage Groq-hosted Llama-70B for lightning-fast, real-time story generation, adapting to user choices instantly.

🎨 **Dynamic Illustrations** – Each story’s visuals are uniquely crafted using LumaLabs’ Photon image generation model, making every book a one-of-a-kind creation.

🐭 **Sassy AI Narration** – Our mascot, booksy the mouse, is voiced using ElevenLabs’ custom voice model, bringing a playful and engaging narration to life.

📚 **Effortless Book Management** – We use Supabase’s database and object storage to keep track of every story created, ensuring families can revisit their cherished tales anytime.

🔐 Secure Authentication – Auth0 handles sign-in and sign-up, providing a frictionless onboarding experience for users.

By seamlessly integrating text, illustrations, and voice in real-time, booksy transforms passive reading into an interactive, co-created experience—making every story feel personal, magical, and memorable. 🚀📖

## Challenges we ran into

On the technical side, the core challenge we faced was minimizing application load times as we needed to generate multimodal elements (story text, accompanying illustrations, and our booksy narrator) in real-time. Another challenge was keeping every new dynamically created page linked with the previous pages of a book. (Think: a linked listed with no previous pointer) For minimizing load times and latency, we relied on the ultra-fast Groq inference for Llama-70B and parallel processed creating the booksy’s voice and accompanying illustrations. For keeping pages linked to each other, we generated a custom UUID for each new book and kept passing this token between the server and the frontend to continue creating new story pages.

A challenge we experienced on the UI/UX side was crafting a user interface that would resonate with both parents and children while maintaining intuitive functionality. Creating an experience that feels magical and engaging for a child, yet remains practical and navigable for adults, requires careful consideration. We wanted to prioritize playful elements without overwhelming the core storytelling experience. We ultimately achieved this balance through a mascot-guided interface and a familiar digital bookshelf element. 

## Accomplishments that we're proud of

We're proud of how our diverse team of first-time and experienced hackers came together to create something special. Our Stanford first-timers brought fresh perspectives that complemented the technical expertise of our seasoned hackers from UBC and UW, leading to an application that exceeded our initial vision and turned into a project that we could all walk away proud of. The design team crafted an interface that perfectly balances whimsy with functionality. On the technical side, we successfully implemented real-time processing of three different types of media - generating text narratives, creating images, and producing voice output - all while maintaining a smooth user experience. Perhaps most importantly, we're proud of creating a platform that doesn't just tell stories, but helps families create and preserve meaningful moments together. 

## What we learned

We quickly learned that effective communication was a powerful tool, being clear and honest about our vision while remaining realistic about what we could accomplish in the hackathon timeframe. Our design team discovered the importance of being responsive, constantly adjusting our UI/UX priorities based on real-time development progress. 

## What's next for booksy

Our primary focus is expanding the platform's collaborative features, enabling extended family members to become involved in a story's narrative. We would plan on integrating video calling capabilities, ensuring that distance never stands in the way of storytime. 

We're also excited about incorporating more interactive elements and diverse genres, while giving our beloved mascot, booksy the mouse, a more prominent role as an engaging guide through the app's features. 

Another idea we are excited about is having parents share their own childhood memories and experiences, transforming them into personalized stories that create deeper connections. 
