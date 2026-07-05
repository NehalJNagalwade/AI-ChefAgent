# ChefAgent: Your Personal Culinary Concierge 👨‍🍳

🚀 **Live Demo:** [https://chefagent-708270570687.asia-southeast1.run.app](https://chefagent-708270570687.asia-southeast1.run.app)

## Problem
Food waste is a massive global problem, and on a personal level, it often stems from not knowing what to cook with the random ingredients left in the fridge. People often resort to ordering takeout because planning a meal and finding a recipe that matches their exact constraints (time, dietary needs, available ingredients) is mentally exhausting. 

## Solution
**ChefAgent** is a highly personalized, conversational culinary concierge. Instead of providing a static recipe that you have to read through while your hands are covered in flour, ChefAgent:
1. **Discovers** what you have and what you need.
2. **Ideates** creative recipes to use up those ingredients.
3. **Guides** you step-by-step through the cooking process interactively. 

You tell it "done" when you finish chopping, and it gives you the next step. If you make a mistake (like burning the onions), ChefAgent dynamically adjusts the plan to save your meal.

## Architecture & Meaningful Use of Agents
- **Frontend:** Built with React, Vite, Tailwind CSS, and Framer Motion for a fluid, chat-like conversational interface.
- **Backend:** Node.js/Express server proxying requests to the Gemini API securely.
- **Agent Integration:** Utilizes the `@google/genai` SDK (`gemini-2.5-flash` model) configured with robust system instructions to act as a stateful concierge. 
- **Agentic Behavior:** ChefAgent demonstrates agentic behavior by maintaining conversational state, reasoning about the user's progress through a recipe, breaking down complex tasks (cooking) into manageable micro-steps, and adapting to real-time user feedback (errors or questions during cooking).

## Setup Instructions
1. Clone the repository.
2. Ensure Node.js is installed.
3. Run \`npm install\` to install dependencies.
4. Set up your environment variables by creating a \`.env\` file in the root directory and adding your Gemini API key:
   \`\`\`
   GEMINI_API_KEY=your_api_key_here
   \`\`\`
5. Start the development server using \`npm run dev\`.
6. Open the application in your browser (usually \`http://localhost:3000\`).
