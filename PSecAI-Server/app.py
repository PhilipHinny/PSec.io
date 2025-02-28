from flask import Flask, request, jsonify
import os
import fitz  
import docx 
import openai

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

openai.api_key = "your-openai-api-key"

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path})

# Extract text from file
def extract_text(file_path):
    if file_path.endswith('.pdf'):
        doc = fitz.open(file_path)  # Corrected usage
        return "\n".join([page.get_text() for page in doc])
    elif file_path.endswith('.docx'):
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    return "Unsupported file format"

# Generate AI Report
@app.route('/generate_report', methods=['POST'])
def generate_report():
    data = request.json
    past_report_text = data.get("text", "")

    if not past_report_text:
        return jsonify({"error": "No text provided"}), 400

    prompt = f"""
    Here is a past report:
    {past_report_text}
    
    Generate a new report in the same style but improved.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )
    return jsonify({"report": response["choices"][0]["message"]["content"]})

# Fetch list of reports
@app.route('/reports', methods=['GET'])
def get_reports():
    reports = [{"title": "Q3 Activity Report", "date": "Feb 24, 2025"}] * 4
    return jsonify(reports)

if __name__ == '__main__':
    app.run(debug=True)
