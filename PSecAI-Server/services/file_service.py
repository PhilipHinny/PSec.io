from pdfminer.high_level import extract_text
from docx import Document
from io import BytesIO

def extract_text_from_file(file):
    # Create an in-memory file object for PDF or DOCX files
    if file.filename.endswith(".pdf"):
        # Use BytesIO to read the PDF file content
        file_content = BytesIO(file.read())
        return extract_text(file_content)  # Extract text from PDF
    elif file.filename.endswith(".docx"):
        # Use BytesIO to read the DOCX file content
        file_content = BytesIO(file.read())
        doc = Document(file_content)
        return "\n".join([p.text for p in doc.paragraphs])  # Extract text from DOCX
    else:
        # If it's a plain text file, just return the content directly
        return file.read().decode("utf-8")  # Plain text file
