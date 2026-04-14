# Quico — The All-in-One AI Study Assistant

An open-source, full-stack educational platform built to supercharge the student learning experience. Quico leverages Large Language Models (LLMs) to automatically generate study materials, breaking down complex topics into bite-sized, interactive formats.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

*Live Demo: [Add your link here]*

---

## Features

Quico features 8 distinct AI-powered utilities designed to help students learn faster and retain more information:

*   **Q&A Revision:** Ask open-ended questions and receive detailed, viva-style explanations.
*   **Smart Flashcards:** Automatically generate spaced-repetition style flashcards from any topic, classified by difficulty.
*   **Interactive Quizzes:** Dynamically generated Multiple Choice Questions testing direct recall, application, and analysis.
*   **AI Mind Maps:** Visual breakdowns of complex subjects, organizing roots, subtopics, and details hierarchically.
*   **Summarizer:** Condense long lectures or articles into brief, exam-focused bullet points.
*   **Notes Finder:** Quickly locate references to handwritten or topper notes.
*   **Past Papers (PYQ):** Locate previous year university question papers for strategic prep.
*   **YouTube Learning:** Curated top study videos for specific academic subjects.

**System Level Features:**
*   **Custom JWT Authentication:** Secure login system using HTTP-only cookies and protected routes.
*   **Persistent User History:** All generated materials are saved to a MongoDB database for future reference.
*   **Structured AI Schemas:** Backend prompt engineering forces strict JSON adherence from the LLMs to safely render interactive UI components.

## Tech Stack

*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
*   **Backend:** Next.js Route Handlers (API), Node.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **AI Integration:** Groq API, Anthropic SDK (Claude)

## Under the Hood (How it works)

Instead of a basic text-completion chatbot, Quico acts as an orchestrated application layer. 

1.  **Strict Prompting:** When a user requests a "Mind Map" or "Quiz", the backend constructs specialized `SYSTEM` prompts. 
2.  **Schema Enforcement:** The LLM is forced to return highly structured JSON (e.g., specific arrays for MCQ options, nested trees for mind maps).
3.  **UI Hydration:** The frontend intercepts this JSON and hydrates interactive React components, transforming raw data into flippable cards, selectable quizzes, and branching trees.

## Local Installation

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Cluster (Atlas or Local)
*   Groq API Key / Anthropic API Key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quico.git
   cd quico
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   *The application will be running at `http://localhost:3000`*

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open-source and available under the [MIT License](LICENSE).

---
*Built by [Shalin Manjul]*
