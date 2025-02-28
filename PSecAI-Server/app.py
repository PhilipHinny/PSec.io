from flask import Flask
from routes.upload_routes import upload_bp
from routes.generate_routes import generate_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(upload_bp, url_prefix="/api")
app.register_blueprint(generate_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
