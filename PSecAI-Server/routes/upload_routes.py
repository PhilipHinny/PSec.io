from flask import Blueprint, request, jsonify
from services.file_service import extract_text_from_file
from database import save_report

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload_report", methods=["POST"])
def upload_report():
    """
    API endpoint to handle file uploads.
    - Extracts user_id from request
    - Extracts text from uploaded files
    - Saves extracted text + metadata to MongoDB
    """
    print("Received upload request")
    print("Form data:", request.form)
    print("Files:", request.files)

    # Retrieve user_id from request
    user_id = request.form.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    # Retrieve the uploaded file
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        print(f"Processing file: {file.filename}")

        # Extract text from the uploaded file
        extracted_text = extract_text_from_file(file)

        # Save metadata and extracted text to MongoDB
        save_report(user_id, file.filename, extracted_text)

        return jsonify({"message": "Report uploaded and saved successfully!"}), 200

    except Exception as e:
        print(f"Error during file upload: {e}")
        return jsonify({"error": "Failed to process the file."}), 500
