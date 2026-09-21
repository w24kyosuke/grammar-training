import json
import sys

def convert_to_json(input_files, output_file):
    questions = []
    for input_file in input_files:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line: continue
                parts = line.split('|')
                if len(parts) != 6: continue
                
                qid = int(parts[0])
                pattern = parts[1]
                japanese = parts[2]
                
                words_raw = parts[3].split(';')
                words = []
                for i, w_raw in enumerate(words_raw):
                    w_parts = w_raw.split(',')
                    words.append({
                        "id": f"w{i+1}",
                        "text": w_parts[0],
                        "pinyin": w_parts[1]
                    })
                
                correct_order = parts[4].split(',')
                explanation = parts[5]
                
                questions.append({
                    "id": qid,
                    "pattern": pattern,
                    "japanese": japanese,
                    "words": words,
                    "correctOrder": correct_order,
                    "explanation": explanation
                })
            
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    input_files = sys.argv[1:-1]
    output_file = sys.argv[-1]
    convert_to_json(input_files, output_file)
