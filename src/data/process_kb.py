import re
import json
import os

def chunk_nextleap_data(file_path):
    """
    Extremely granular chunking to ensure the bot can answer specific questions
    about instructors, weeks, and pricing without mixing them up.
    """
    if not os.path.exists(file_path):
        return f"Error: File not found at {file_path}"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by Cohorts
    cohort_sections = re.split(r'\n## \d\.', content)
    # The first split is the header, but check if it's empty
    if len(cohort_sections) > 1:
        cohort_sections = cohort_sections[1:] 
    
    all_chunks = []

    for section in cohort_sections:
        lines = section.strip().split('\n')
        if not lines: continue
        cohort_name_line = lines[0].strip()
        # Clean up "1. Product Manager Fellowship" -> "Product Manager Fellowship"
        cohort_name = re.sub(r'^\d+\.\s*', '', cohort_name_line)
        
        # Extract URL
        url_match = re.search(r'- \*\*URL\*\*: (.*)', section)
        url = url_match.group(1) if url_match else "N/A"
        
        # 1. Broad Chunk (Overall Context)
        all_chunks.append({
            "content": f"Full information about {cohort_name}: {section.strip()}",
            "metadata": {"cohort": cohort_name, "type": "overview", "url": url}
        })

        # 2. Pricing & Enrollment
        pricing_match = re.search(r'- \*\*Pricing\*\*: (.*)', section)
        if pricing_match:
            all_chunks.append({
                "content": f"The price for {cohort_name} is {pricing_match.group(1)}.",
                "metadata": {"cohort": cohort_name, "type": "pricing", "url": url}
            })

        # 3. Next Cohort Date
        date_match = re.search(r'- \*\*Next Cohort\*\*: (.*)', section)
        if date_match:
            all_chunks.append({
                "content": f"The next cohort for {cohort_name} starts on {date_match.group(1)}.",
                "metadata": {"cohort": cohort_name, "type": "date", "url": url}
            })

        # 4. Granular Curriculum (Week by Week)
        curr_match = re.search(r'- \*\*(?:Curriculum|Curriculum Overview.*?)\*\*:(.*?)(?=- \*\*Instructors|\Z)', section, re.DOTALL)
        if curr_match:
            # Match both "- Weeks 1-3: ..." and "    - Weeks 1-3: ..."
            modules = re.findall(r'^\s*-\s+(Weeks?\s+\d+.*?):\s*(.*)', curr_match.group(1), re.MULTILINE)
            for week, desc in modules:
                all_chunks.append({
                    "content": f"In {cohort_name}, {week} covers {desc}.",
                    "metadata": {"cohort": cohort_name, "type": "curriculum", "week": week, "url": url}
                })

        # 5. Granular Instructors (One by One)
        inst_match = re.search(r'- \*\*Instructors & Mentors\*\*:(.*)', section, re.DOTALL)
        if inst_match:
            # Match "- **Name**: Bio"
            instructors = re.findall(r'^\s*-\s+\*\*(.*?)\*\*:\s*(.*)', inst_match.group(1), re.MULTILINE)
            for name, bio in instructors:
                all_chunks.append({
                    "content": f"{name} is an instructor for {cohort_name}. Bio: {bio}",
                    "metadata": {"cohort": cohort_name, "type": "instructor", "name": name, "url": url}
                })

    return all_chunks

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    KB_PATH = os.path.join(current_dir, "nextleap_kb.md")
    OUT_PATH = os.path.join(current_dir, "chunks.json")
    
    print(f"Reading from: {KB_PATH}")
    chunks = chunk_nextleap_data(KB_PATH)
    if isinstance(chunks, str):
        print(chunks)
    else:
        with open(OUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, indent=4)
        print(f"Successfully created {len(chunks)} granular chunks in {OUT_PATH}")
