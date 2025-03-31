from flask import Flask
from flask_cors import CORS
from routes.upload_routes import upload_bp
from routes.generate_routes import generate_bp
from routes.get_reports_routes import get_reports_bp
from routes.sidebar import report_bp

app = Flask(__name__)

# Enable CORS globally
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(generate_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(get_reports_bp)
app.register_blueprint(report_bp)

if __name__ == "__main__":
    app.run(debug=True)
