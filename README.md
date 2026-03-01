# 🚀 NextLeap RAG Chatbot

A premium, high-performance RAG (Retrieval-Augmented Generation) chatbot built for NextLeap Fellowship inquiries. This assistant uses a local Vector Database and the Llama-3-70B model (via Groq) to provide structured, accurate information about fellowships.

![NextLeap Banner](https://nextleap.app/images/logo.png)

## ✨ Features

- **Brain:** Powered by `Llama-3-3-70b-versatile` via **Groq** for lightning-fast inference.
- **RAG Architecture:** custom local Vector Database with **Cosine Similarity** search for high-precision retrieval.
- **Deep Data:** Crawled knowledge base including FAQs, Prerequisites, Tools, and Career Outcomes.
- **Premium UI:** 
  - Emerald-themed Dark Mode.
  - Glassmorphism & Framer Motion animations.
  - Full Markdown support (Tables, Lists, Bold text).
- **Responsive:** Mobile-first design for a seamless experience on all devices.

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS 4
- **AI Logic:** OpenAI SDK (configured for Groq)
- **Data Store:** Local Vector Vault (.json)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/nextleap-chat.git
cd nextleap-chat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory:
```text
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

- `src/app/api/chat/route.ts`: Core RAG logic & LLM orchestration.
- `src/lib/vectorDatabase.ts`: Custom Vector Search engine.
- `src/data/nextleap_kb_v2.md`: Structured knowledge source.
- `src/components/ChatInterface.tsx`: Main UI component.

## 📜 License
MIT
