# PSec AI

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PSec AI is an AI-powered web application designed to generate personalized reports based on a user's previously written reports. Unlike predefined templates, PSec AI learns from user-uploaded documents to create reports in a similar format, ensuring consistency and personalization. The system uses machine learning to analyze document structure, tone, and formatting patterns, then generates new reports that match the user's writing style.

## ✨ Features

- **Custom Report Generation**: Generates reports based on personal uploaded documents
- **Format Adaptation**: Learns from the structure and style of user-submitted reports
- **AI-Powered Learning**: Adapts to different writing styles and formatting preferences using OpenRouter API
- **Document Management**: Upload, view, and manage your documents in a centralized dashboard
- **Report History**: Track all generated reports with full history and activity logs
- **User Authentication**: Secure authentication using Firebase (Google OAuth, email/password)
- **Payment Integration**: Paystack integration for subscription management
- **Activity Tracking**: Real-time activity feed showing uploads, generations, and system events
- **Report Statistics**: Dashboard with insights into report generation metrics
- **Export Options**: Download reports in PDF or DOCX formats
- **Todo Management**: Built-in task management system
- **Responsive Design**: Modern, user-friendly interface that works on all devices

## 🏗️ Architecture

PSec AI follows a **client-server architecture**:

### Frontend (PSecAI-Client)
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (for user data)
- **Storage**: Firebase Storage (for file uploads)
- **UI Components**: Custom React components with CSS modules

### Backend (PSecAI-Server)
- **Framework**: Flask (Python)
- **AI Service**: OpenRouter API (Mistral AI models)
- **Database**: MongoDB (for report metadata, activities, user plans)
- **File Processing**: PDF and DOCX extraction using pdfminer.six and python-docx
- **API Architecture**: RESTful API with Flask blueprints
- **CORS**: Configured for cross-origin requests

### Data Flow
1. User uploads a document → Frontend sends to backend → Backend extracts text → Stored in MongoDB
2. User requests report generation → Frontend sends prompt → Backend queries MongoDB for user's previous reports → Sends context to OpenRouter API → Returns generated report → Saved to MongoDB
3. User views dashboard → Frontend queries backend → Backend retrieves data from MongoDB → Returns to frontend

## 🛠️ Tech Stack

### Frontend
- **React** 19.0.0
- **Vite** 6.2.2
- **React Router DOM** 7.2.0
- **Firebase** 11.3.1 (Authentication, Firestore, Storage)
- **Axios** 1.8.4
- **React Markdown** 10.1.0
- **Stripe** (for payment processing)
- **Lucide React** (icons)
- **React Dropzone** (file uploads)
- **html2pdf.js** & **jsPDF** (PDF generation)
- **docx** (Word document generation)

### Backend
- **Python** 3.11.8
- **Flask** (web framework)
- **Flask-CORS** (CORS handling)
- **MongoDB** (via pymongo)
- **OpenRouter API** (AI model integration)
- **pdfminer.six** (PDF text extraction)
- **python-docx** (DOCX processing)
- **FPDF** (PDF generation)
- **httpx** (async HTTP client)
- **python-dotenv** (environment variables)
- **gunicorn** (production WSGI server)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and **npm**
- **Python** 3.11.8 or higher
- **MongoDB** (local or MongoDB Atlas account)
- **Firebase** account (for authentication and storage)
- **OpenRouter API** account (for AI services)
- **Paystack** account (for payments, optional)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/psec-ai.git
cd PSec.io
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd PSecAI-Server

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd PSecAI-Client

# Install Node.js dependencies
npm install
```

### 4. Environment Configuration

#### Backend (.env file in PSecAI-Server/)
Create a `.env` file in the `PSecAI-Server` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=PSECAI_db

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here
REFERER=http://localhost:5173

# Paystack (optional)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

#### Frontend (.env file in PSecAI-Client/)
Create a `.env` file in the `PSecAI-Client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Note: Firebase configuration is already set in `firebaseConfig.js`. For production, consider moving it to environment variables.

### 5. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication (Email/Password and Google OAuth)
4. Create a Firestore database
5. Enable Firebase Storage
6. Copy your Firebase config and update `PSecAI-Client/src/firebaseConfig.js`

### 6. MongoDB Setup

1. Create a MongoDB Atlas account or use local MongoDB
2. Create a database cluster
3. Get your connection string
4. Update `MONGO_URI` in your backend `.env` file

## ⚙️ Configuration

### Backend Configuration (`PSecAI-Server/config.py`)
- **MONGO_URI**: MongoDB connection string
- **DB_NAME**: Database name (default: `PSECAI_db`)

### CORS Configuration (`PSecAI-Server/app.py`)
Allowed origins:
- `https://psec-ai.web.app`
- `http://psec-ai.web.app`
- `http://localhost:5173`
- `http://localhost:3000`

### API Base URL (`PSecAI-Client/src/apiConfig.js`)
Configured via `VITE_API_BASE_URL` environment variable.

## 📁 Project Structure

```
PSec.io/
│
├── PSecAI-Client/              # Frontend React Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ReportTab.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── MyDocumentPage.jsx
│   │   │   └── ...
│   │   ├── styles/             # CSS files
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   ├── firebaseConfig.js   # Firebase configuration
│   │   └── apiConfig.js        # API configuration
│   ├── package.json
│   ├── vite.config.js
│   └── dist/                   # Build output
│
├── PSecAI-Server/              # Backend Flask Application
│   ├── routes/                 # API route blueprints
│   │   ├── upload_routes.py
│   │   ├── generate_routes.py
│   │   ├── get_reports_routes.py
│   │   ├── sidebar.py
│   │   ├── RecentActivity.py
│   │   ├── Report_Stats.py
│   │   ├── ReportGenerationHistory.py
│   │   ├── Downloads.py
│   │   ├── DashboardUpload.py
│   │   ├── deleteDocument.py
│   │   ├── paystackpayment.py
│   │   └── chat_sessions.py
│   ├── services/               # Business logic
│   │   ├── ai_service.py       # AI/OpenRouter integration
│   │   └── file_service.py     # File processing
│   ├── db/                     # Database utilities
│   │   └── vector_db.py
│   ├── downloads/              # Generated file downloads
│   ├── app.py                  # Flask application entry point
│   ├── config.py               # Configuration
│   ├── database.py             # MongoDB utilities
│   ├── requirements.txt        # Python dependencies
│   └── runtime.txt             # Python version for deployment
│
└── README.md                   # This file
```

## 🔌 API Documentation

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-production-url.com`

### Authentication
Most endpoints require a `user_id` in the request body or as a query parameter.

### Endpoints

#### 1. Upload Report
**POST** `/upload_report`

Upload a document (PDF or DOCX) for analysis and reference.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `user_id` (string, required): User identifier
  - `file` (file, required): PDF or DOCX file

**Response:**
```json
{
  "message": "Report uploaded and saved successfully!"
}
```

#### 2. Generate Report
**POST** `/generate_report`

Generate a new report based on user's uploaded documents and prompt.

**Request:**
```json
{
  "user_id": "user123",
  "prompt": "Create a Q2 2025 sales report",
  "edit_prompt": null,  // Optional: for editing existing reports
  "follow_up_prompt": null  // Optional: for follow-up questions
}
```

**Response:**
```json
{
  "generated_report": "Generated report content in markdown format..."
}
```

#### 3. Get Reports
**GET** `/get_reports`

Retrieve all reports for a user.

**Query Parameters:**
- `user_id` (string, required)

**Response:**
```json
{
  "reports": [
    {
      "filename": "report1.pdf",
      "created_at": "2025-01-15T10:30:00Z",
      "extracted_text": "..."
    }
  ]
}
```

#### 4. Recent Activity
**GET** `/recent_activity`

Get recent activity log for a user.

**Query Parameters:**
- `user_id` (string, required)

#### 5. Report Statistics
**GET** `/report_stats`

Get statistics about user's reports.

**Query Parameters:**
- `user_id` (string, required)

#### 6. Report Generation History
**GET** `/generate_history`

Get history of generated reports.

**Query Parameters:**
- `user_id` (string, required)

#### 7. Download Report
**GET** `/download_report/{report_id}`

Download a generated report in PDF or DOCX format.

#### 8. Delete Document
**DELETE** `/delete_document`

Delete an uploaded document.

**Request:**
```json
{
  "user_id": "user123",
  "document_id": "doc123"
}
```

#### 9. Paystack Payment
**POST** `/paystack/initialize`

Initialize a payment transaction.

**POST** `/paystack/verify`

Verify a payment transaction.

### Error Responses

All endpoints may return errors in the following format:

```json
{
  "error": "Error message description"
}
```

Status codes:
- `200`: Success
- `400`: Bad Request (missing parameters)
- `500`: Internal Server Error

## 📖 Usage Guide

### Starting the Application

#### 1. Start Backend Server

```bash
cd PSecAI-Server
python app.py
```

The server will run on `http://localhost:5000`

#### 2. Start Frontend Development Server

```bash
cd PSecAI-Client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Using the Application

1. **Sign Up / Login**
   - Navigate to the application
   - Click "Login" or "Sign Up"
   - Authenticate using Google OAuth or email/password

2. **Upload a Document**
   - Go to "Upload Page" or "My Documents"
   - Click "Upload" and select a PDF or DOCX file
   - Wait for upload confirmation

3. **Generate a Report**
   - Navigate to the Home page
   - Click "Generate Report"
   - Enter a prompt describing the report you want
   - Click "Generate"
   - Wait for the AI to generate the report

4. **View Generated Reports**
   - Go to "Dashboard" to see all your reports
   - Click on a report to view details
   - Download as PDF or DOCX

5. **Manage Documents**
   - Go to "My Documents" to see all uploaded documents
   - Delete documents you no longer need
   - View document history

6. **Track Activity**
   - Visit "Activity Page" to see recent activities
   - Monitor uploads, generations, and system events

## 👨‍💻 Development

### Frontend Development

```bash
cd PSecAI-Client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend Development

```bash
cd PSecAI-Server

# Run Flask development server
python app.py

# Or use Flask's development server with auto-reload
flask run --reload
```

### Adding New Features

1. **Frontend Component**: Add to `PSecAI-Client/src/components/`
2. **Frontend Page**: Add to `PSecAI-Client/src/pages/` and register route in `App.jsx`
3. **Backend Route**: Add blueprint to `PSecAI-Server/routes/` and register in `app.py`
4. **Backend Service**: Add business logic to `PSecAI-Server/services/`

### Database Schema

#### MongoDB Collections

1. **Uploaded_Reports**
   ```json
   {
     "user_id": "string",
     "filename": "string",
     "extracted_text": "string",
     "created_at": "datetime"
   }
   ```

2. **Recent_Activity**
   ```json
   {
     "user_id": "string",
     "document_name": "string",
     "action": "string",
     "status": "string",
     "date_time": "string"
   }
   ```

3. **User_Plans**
   ```json
   {
     "user_id": "string",
     "plan_type": "string",
     "status": "string"
   }
   ```

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)

```bash
cd PSecAI-Client

# Build the application
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy
firebase deploy
```

### Backend Deployment (Heroku/Railway/Render)

1. **Create `Procfile`** in `PSecAI-Server/`:
   ```
   web: gunicorn app:app
   ```

2. **Set Environment Variables** in your hosting platform:
   - `MONGO_URI`
   - `OPENROUTER_API_KEY`
   - `REFERER`
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY`

3. **Deploy**:
   ```bash
   git push heroku main  # For Heroku
   ```

### Environment Variables for Production

Update CORS origins in `PSecAI-Server/app.py` to include your production frontend URL.

Update `VITE_API_BASE_URL` in frontend `.env` to point to your production backend.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: Follow React best practices and use ESLint
- **Backend**: Follow PEP 8 Python style guide
- **Commit Messages**: Use clear, descriptive commit messages

## 📝 License

[Add your license here]

## 🔗 Links

- **Figma Design**: [PSec AI Design](https://www.figma.com/design/XmqwYk5dCXE9R7ld42o1EK/PSec-AI?node-id=0-1&t=7sQHeB7RQ8tFhBnl-1)
- **Firebase**: [Firebase Console](https://console.firebase.google.com/)
- **OpenRouter**: [OpenRouter API](https://openrouter.ai/)
- **MongoDB Atlas**: [MongoDB Cloud](https://www.mongodb.com/cloud/atlas)

## 📧 Contact

[Add your contact information here]

---

**Made with ❤️ by the PSec AI Team**
