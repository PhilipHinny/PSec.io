from pdfminer.high_level import extract_text
from docx import Document

def extract_text_from_file(file):
    if file.filename.endswith(".pdf"):
        return extract_text(file)
    elif file.filename.endswith(".docx"):
        doc = Document(file)
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        return file.read().decode("utf-8")  # Plain text file
