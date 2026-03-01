import { NextLeapDB } from './src/lib/vectorDatabase';
import path from 'path';

const db = NextLeapDB.getInstance();
const kbPath = path.join(process.cwd(), 'src/data/nextleap_kb_final.md');
db.ingest(kbPath);

const results = db.search("who is teaching product management?", 3);
console.log(JSON.stringify(results.map(r => ({ cohort: r.metadata.cohort, score: r.score })), null, 2));
