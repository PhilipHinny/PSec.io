from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.upload_routes import upload_bp
from routes.generate_routes import generate_bp
from routes.get_reports_routes import get_reports_bp
from routes.sidebar import report_bp
from routes.RecentActivity import activity_bp
from routes.Report_Stats import stats_bp
from routes.ReportGenerationHistory import Generate_bp
from routes.Downloads import Download_bp
from routes.DashboardUpload import Dashboardupload_bp
from routes.deleteDocument import Deleteupload_bp
from routes.paystackpayment import paystackPayment_bp
from routes.paystackpayment import paystackPaymentkey_bp
from routes.chat_sessions import chat_bp


app = Flask(__name__)

# Load environment variables from .env file at the project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

paystack_secret_key = os.getenv('PAYSTACK_SECRET_KEY')
paystack_public_key = os.getenv('PAYSTACK_PUBLIC_KEY')

# Enable CORS globally with specific settings
CORS(app, 
     origins=["https://psec-ai.web.app", "http://psec-ai.web.app", "http://localhost:5173", "http://localhost:3000"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     supports_credentials=True,
     expose_headers=["Content-Type", "Authorization"])

# Register blueprints with unique names
app.register_blueprint(generate_bp, name='generate')
app.register_blueprint(upload_bp, name='upload')
app.register_blueprint(get_reports_bp, name='get_reports')
app.register_blueprint(report_bp, name='sidebar')
app.register_blueprint(activity_bp, name='recent_activity')
app.register_blueprint(stats_bp, name='report_stats')  
app.register_blueprint(Generate_bp, name='generate_history')
app.register_blueprint(Download_bp, name='download_report')
app.register_blueprint(Dashboardupload_bp, name='Dashboard_Upload_report')
app.register_blueprint(Deleteupload_bp, name='Delete_Upload_report')
app.register_blueprint(paystackPayment_bp, url_prefix='/paystack')
app.register_blueprint(paystackPaymentkey_bp, url_prefix='/paystack')
app.register_blueprint(chat_bp, name='chat_sessions')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
