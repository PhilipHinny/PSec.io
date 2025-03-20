from flask import Blueprint, request, jsonify

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload_report", methods=["POST"])
def upload_report():
    # Print out form data and files for debugging
    print("Form data:", request.form)
    print("Files:", request.files)

    # Get user_id from form data
    user_id = request.form.get("user_id")
    print("User ID:", user_id)

    # Get file from request
    file = request.files.get("file")  # Get the file from the request
    if not file:
        print("No file uploaded")
        return jsonify({"error": "No file uploaded"}), 400
    
    try:
        # Process the file (This is where you'll extract text, etc.)
        print("File received:", file.filename)

        # Assuming this function exists to handle the file
        # For now, just return success message for debugging
        return jsonify({"message": "Report uploaded successfully!"}), 200

    except Exception as e:
        print(f"Error during file upload: {e}")
        return jsonify({"error": "Failed to process the file."}), 500
