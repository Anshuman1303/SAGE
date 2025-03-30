from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import torch
import fitz  # PyMuPDF for extracting text from PDFs
import re
from transformers import DebertaV2Tokenizer, DebertaV2ForSequenceClassification

app = FastAPI()

# Load the fine-tuned model from Hugging Face
model_path = "vdhkcheems/SAGE"
tokenizer = DebertaV2Tokenizer.from_pretrained(model_path)
model = DebertaV2ForSequenceClassification.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
model.eval()

# Function to extract numbered questions/answers from a PDF
def extract_numbered_text(pdf_file):
    """Extracts and maps numbered questions/answers from a PDF."""
    text = ""
    with fitz.open(pdf_file) as doc:
        for page in doc:
            text += page.get_text("text") + "\n"

    # Regex pattern to detect numbered questions/answers (e.g., "1. What is AI?")
    pattern = r"(\d+)\.\s*(.+)"
    matches = re.findall(pattern, text)

    numbered_data = {int(num): content.strip() for num, content in matches}
    return numbered_data  # Returns {1: "Question text", 2: "Next question", ...}

@app.post("/predict_from_pdfs/")
async def predict_from_pdfs(
    questions_file: UploadFile = File(...),
    reference_answers_file: UploadFile = File(...),
    student_answers_file: UploadFile = File(...)
):
    # Extract text with proper numbering
    questions = extract_numbered_text(questions_file.file)
    reference_answers = extract_numbered_text(reference_answers_file.file)
    student_answers = extract_numbered_text(student_answers_file.file)

    results = {}

    # Loop through all expected questions (based on the questions PDF)
    for q_num, question_text in questions.items():
        ref_answer = reference_answers.get(q_num, "")  # Get ref answer or empty string
        stud_answer = student_answers.get(q_num, None)  # Get student answer or None

        if stud_answer is None:
            # If student did not answer, assign label 9
            results[f"question_{q_num}"] = 9
            continue

        text = f"{question_text} [SEP] {ref_answer} [SEP] {stud_answer}"
        
        # Tokenize input
        encoding = tokenizer(
            text,
            max_length=1024,
            truncation=True,
            padding="max_length",
            return_tensors="pt"
        )

        input_ids = encoding["input_ids"].to(device)
        attention_mask = encoding["attention_mask"].to(device)

        # Get model prediction
        with torch.no_grad():
            outputs = model(input_ids, attention_mask=attention_mask)
            prediction = torch.argmax(outputs.logits, dim=1).item()

        # Store result
        results[f"question_{q_num}"] = prediction

    return results