from flask import Flask
from flask_cors import CORS  # Import CORS
from routes.upload_routes import upload_bp
from routes.generate_routes import generate_bp

app = Flask(__name__)

# Enable CORS for all routes globally
CORS(app, origins=["http://localhost:5173"])  

app.register_blueprint(generate_bp)  
app.register_blueprint(upload_bp)  

if __name__ == "__main__":
    app.run(debug=True)
