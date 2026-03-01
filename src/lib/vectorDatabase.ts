import fs from 'fs';
import path from 'path';

export interface VectorChunk {
    content: string;
    metadata: {
        cohort: string;
        type: string;
        url: string;
    };
    vector?: number[];
}

export class NextLeapDB {
    private static instance: NextLeapDB;
    private dbPath = path.join(process.cwd(), 'src/data/vector_db.json');
    private chunks: VectorChunk[] = [];

    constructor() {
        this.load();
    }

    public static getInstance(): NextLeapDB {
        if (!NextLeapDB.instance) NextLeapDB.instance = new NextLeapDB();
        return NextLeapDB.instance;
    }

    // A simple but effective Word-Vector generator (TF-IDF style)
    // This turns text into a "Coordinate" for the database to search.
    private generateSimpleVector(text: string): number[] {
        const commonWords = new Set(['the', 'and', 'for', 'with', 'about', 'is', 'are', 'was', 'were']);
        const words = text.toLowerCase().match(/\w+/g) || [];
        const uniqueWords = Array.from(new Set(words)).filter(w => w.length > 2 && !commonWords.has(w));

        // In a real DB, these would be 1536-dimensional numbers from OpenAI.
        // Here we simulate the pattern.
        const vector = new Array(100).fill(0);
        uniqueWords.forEach(word => {
            let hash = 0;
            for (let i = 0; i < word.length; i++) hash = (hash << 5) - hash + word.charCodeAt(i);
            const index = Math.abs(hash % 100);
            vector[index] += 1;
        });
        return vector;
    }

    private cosineSimilarity(vec1: number[], vec2: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            normA += vec1[i] * vec1[i];
            normB += vec2[i] * vec2[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
    }

    public ingest(markdownPath: string) {
        const content = fs.readFileSync(markdownPath, 'utf8');
        const sections = content.split('---');

        this.chunks = sections.map(section => {
            const cohortMatch = section.match(/## \d\.\s*(.*)/);
            const urlMatch = section.match(/- \*\*URL\*\*: (.*)/);

            return {
                content: section.trim(),
                metadata: {
                    cohort: cohortMatch ? cohortMatch[1] : "General",
                    type: "section",
                    url: urlMatch ? urlMatch[1] : "N/A"
                },
                vector: this.generateSimpleVector(section)
            };
        }).filter(c => c.content.length > 10);

        // Only write to disk if we are in a local environment
        // Vercel has a read-only filesystem
        if (process.env.NODE_ENV !== 'production') {
            try {
                fs.writeFileSync(this.dbPath, JSON.stringify(this.chunks, null, 2));
            } catch (e) {
                console.log("Could not write DB to disk (likely production environment)");
            }
        }
    }

    private load() {
        if (fs.existsSync(this.dbPath)) {
            this.chunks = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
        }
    }

    public search(query: string, limit = 3): VectorChunk[] {
        const queryVec = this.generateSimpleVector(query);
        return this.chunks
            .map(chunk => ({
                ...chunk,
                score: this.cosineSimilarity(queryVec, chunk.vector || [])
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
