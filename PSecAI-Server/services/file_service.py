from pdfminer.high_level import extract_text
from docx import Document
from io import BytesIO

def extract_text_from_file(file):
    """
    Extracts text from different file types (PDF, DOCX, TXT).
    """
    if file.filename.endswith(".pdf"):
        file_content = BytesIO(file.read())
        return extract_text(file_content)  # Extract text from PDF
    elif file.filename.endswith(".docx"):
        file_content = BytesIO(file.read())
        doc = Document(file_content)
        return "\n".join([p.text for p in doc.paragraphs])  # Extract text from DOCX
    else:
        return file.read().decode("utf-8")  # Handle plain text files
