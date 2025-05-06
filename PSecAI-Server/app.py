from flask import Flask
from flask_cors import CORS
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

app = Flask(__name__)

# Enable CORS globally
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

