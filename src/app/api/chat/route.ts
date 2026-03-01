import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextLeapDB } from '@/lib/vectorDatabase'; // Import our new database service

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Groq API Key (GROQ_API_KEY) missing in .env.local.' }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey,
            baseURL: "https://api.groq.com/openai/v1"
        });

        const { messages } = await req.json();
        const userQuery = messages[messages.length - 1].content;

        // 1. Database Connection & Synchronization
        // We connect to the NEW    // 1. Database Connection & Synchronization
        const db = NextLeapDB.getInstance();
        const kbPath = path.join(process.cwd(), 'src/data/nextleap_kb_v2.md');

        // Always sync the database with the latest Markdown file
        db.ingest(kbPath);

        // 2. Vector DB Query (Search by meaning/similarity)
        // Instead of simple keyword matching, we now use the DB's search engine.
        const results = db.search(userQuery, 3);
        const context = results.map(r => r.content).join('\n\n---\n\n');

        // 3. Construct System Prompt
        const systemPrompt = `
      You are the NextLeap Fellowship Assistant, connected to a specialized Vector Database.
      Your task is to answer the user's question using the provided context.

      RESPONSE RULES:
      1. COMPARISONS: When asked to compare cohorts, you MUST use a Markdown table. Columns should be: Parameter, Cohort A, Cohort B.
      2. Parameters: Compare on specific features like Duration, Price, Next Start Date, and Target Audience.
      3. STRUCTURE: Use professional, clean Markdown. Use bolding and lists appropriately.
      4. ACCURACY: If information is missing, say you don't have it specifically.
      5. PRICING: ₹34,999 (Discounted) / ₹49,999 (Original).

      CONTEXT FROM NEXTLEAP DATABASE:
      ${context}
    `;

        // 4. Groq LLM Completion
        const response = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.1,
        });

        return NextResponse.json({
            content: response.choices[0].message.content,
        });

    } catch (error: any) {
        console.error('Vector DB & Chat Error:', error);
        return NextResponse.json({ error: 'The Database encountered an error.' }, { status: 500 });
    }
}
