# PSec AI API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-production-url.com`

## Authentication
Most endpoints require a `user_id` parameter. The user_id is obtained from Firebase Authentication and should be passed in the request body or as a query parameter.

---

## Endpoints

### 1. Upload Report

Upload a document (PDF or DOCX) for analysis and reference.

**Endpoint:** `POST /upload_report`

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body:**
  - `user_id` (string, required): Firebase user UID
  - `file` (file, required): PDF or DOCX file (max size: depends on server configuration)

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/upload_report \
  -F "user_id=user123" \
  -F "file=@/path/to/report.pdf"
```

**Example Request (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('user_id', 'user123');
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/upload_report', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**Success Response (200):**
```json
{
  "message": "Report uploaded and saved successfully!"
}
```

**Error Responses:**
- `400 Bad Request`: Missing user_id or file
  ```json
  {
    "error": "User ID is required"
  }
  ```
- `500 Internal Server Error`: File processing failed
  ```json
  {
    "error": "Failed to process the file."
  }
  ```

---

### 2. Generate Report

Generate a new report based on user's uploaded documents and prompt.

**Endpoint:** `POST /generate_report`

**Request:**
- **Content-Type**: `application/json`
- **Body:**
  ```json
  {
    "user_id": "string (required)",
    "prompt": "string (required if edit_prompt and follow_up_prompt are not provided)",
    "edit_prompt": "string (optional)",
    "follow_up_prompt": "string (optional)"
  }
  ```

**Parameters:**
- `user_id` (string, required): Firebase user UID
- `prompt` (string, required if others not provided): Description of the report to generate
- `edit_prompt` (string, optional): Prompt for editing an existing report
- `follow_up_prompt` (string, optional): Follow-up question or modification request

**Example Request:**
```json
{
  "user_id": "user123",
  "prompt": "Create a comprehensive Q2 2025 sales report with detailed analytics and projections"
}
```

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/generate_report \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "prompt": "Create a Q2 2025 sales report"
  }'
```

**Success Response (200):**
```json
{
  "generated_report": "# Q2 2025 Sales Report\n\n## Executive Summary\n..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing required parameters
  ```json
  {
    "error": "Missing user_id and prompt or edit/follow-up prompt"
  }
  ```
- `500 Internal Server Error`: AI generation failed
  ```json
  {
    "error": "Could not generate report."
  }
  ```

**Notes:**
- The generated report is in Markdown format
- The system uses the most recent uploaded report as a template for formatting
- Generation may take 10-30 seconds depending on report length

---

### 3. Get Reports

Retrieve all uploaded reports for a user.

**Endpoint:** `GET /get_reports`

**Query Parameters:**
- `user_id` (string, required): Firebase user UID

**Example Request:**
```
GET /get_reports?user_id=user123
```

**Success Response (200):**
```json
{
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "user123",
      "filename": "Q1_Report_2025.pdf",
      "extracted_text": "Full extracted text content...",
      "created_at": "2025-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "user_id": "user123",
      "filename": "Annual_Report_2024.docx",
      "extracted_text": "Full extracted text content...",
      "created_at": "2025-01-10T14:20:00.000Z"
    }
  ]
}
```

**Error Response:**
- `400 Bad Request`: Missing user_id
  ```json
  {
    "error": "User ID is required"
  }
  ```

---

### 4. Recent Activity

Get recent activity log for a user.

**Endpoint:** `GET /recent_activity`

**Query Parameters:**
- `user_id` (string, required): Firebase user UID

**Example Request:**
```
GET /recent_activity?user_id=user123
```

**Success Response (200):**
```json
{
  "activities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "user_id": "user123",
      "document_name": "Q2_Report_2025.pdf",
      "action": "Generated",
      "status": "Successful",
      "date_time": "Jan 15, 2025, 02:30 PM"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "user_id": "user123",
      "document_name": "Sales_Report.pdf",
      "action": "Uploaded",
      "status": "Successful",
      "date_time": "Jan 14, 2025, 10:15 AM"
    }
  ]
}
```

**Possible Actions:**
- `"Uploaded"`: Document was uploaded
- `"Generated"`: Report was generated
- `"Deleted"`: Document was deleted

**Possible Status:**
- `"Successful"`: Operation completed successfully
- `"Failed"`: Operation failed

---

### 5. Report Statistics

Get statistics about user's reports.

**Endpoint:** `GET /report_stats`

**Query Parameters:**
- `user_id` (string, required): Firebase user UID

**Example Request:**
```
GET /report_stats?user_id=user123
```

**Success Response (200):**
```json
{
  "total_reports": 15,
  "total_uploads": 8,
  "total_generated": 7,
  "successful_generations": 6,
  "failed_generations": 1,
  "last_activity": "Jan 15, 2025, 02:30 PM"
}
```

---

### 6. Report Generation History

Get history of all generated reports.

**Endpoint:** `GET /generate_history`

**Query Parameters:**
- `user_id` (string, required): Firebase user UID

**Example Request:**
```
GET /generate_history?user_id=user123
```

**Success Response (200):**
```json
{
  "history": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "user_id": "user123",
      "report_title": "Q2 2025 Sales Report",
      "prompt": "Create a Q2 2025 sales report",
      "generated_at": "2025-01-15T14:30:00.000Z",
      "status": "Completed"
    }
  ]
}
```

---

### 7. Download Report

Download a generated report in PDF or DOCX format.

**Endpoint:** `GET /download_report/{report_id}`

**Path Parameters:**
- `report_id` (string, required): Report identifier

**Query Parameters:**
- `format` (string, optional): `pdf` or `docx` (default: `pdf`)

**Example Request:**
```
GET /download_report/507f1f77bcf86cd799439015?format=pdf
```

**Success Response (200):**
- Returns file download with appropriate Content-Type header
- `application/pdf` for PDF files
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` for DOCX files

**Error Response:**
- `404 Not Found`: Report not found
  ```json
  {
    "error": "Report not found"
  }
  ```

---

### 8. Delete Document

Delete an uploaded document.

**Endpoint:** `DELETE /delete_document`

**Request:**
- **Content-Type**: `application/json`
- **Body:**
  ```json
  {
    "user_id": "string (required)",
    "document_id": "string (required)"
  }
  ```

**Example Request:**
```json
{
  "user_id": "user123",
  "document_id": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing parameters
  ```json
  {
    "error": "User ID and document ID are required"
  }
  ```
- `404 Not Found`: Document not found
  ```json
  {
    "error": "Document not found"
  }
  ```

---

### 9. Dashboard Upload

Upload a document from the dashboard.

**Endpoint:** `POST /dashboard_upload`

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body:**
  - `user_id` (string, required): Firebase user UID
  - `file` (file, required): PDF or DOCX file

**Response:**
Same as `/upload_report` endpoint.

---

### 10. Paystack Payment - Initialize

Initialize a payment transaction.

**Endpoint:** `POST /paystack/initialize`

**Request:**
- **Content-Type**: `application/json`
- **Body:**
  ```json
  {
    "user_id": "string (required)",
    "amount": "number (required)",
    "email": "string (required)",
    "plan": "string (optional)"
  }
  ```

**Success Response (200):**
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "access_code_here",
  "reference": "reference_here"
}
```

---

### 11. Paystack Payment - Verify

Verify a payment transaction.

**Endpoint:** `POST /paystack/verify`

**Request:**
- **Content-Type**: `application/json`
- **Body:**
  ```json
  {
    "reference": "string (required)"
  }
  ```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Payment verified",
  "data": {
    "amount": 5000,
    "status": "success",
    "reference": "reference_here"
  }
}
```

---

### 12. Chat Sessions

Manage chat sessions for report generation.

**Endpoint:** `POST /chat_sessions`

**Request:**
- **Content-Type**: `application/json`
- **Body:**
  ```json
  {
    "user_id": "string (required)",
    "message": "string (required)",
    "session_id": "string (optional)"
  }
  ```

**Success Response (200):**
```json
{
  "response": "AI generated response...",
  "session_id": "session_id_here"
}
```

---

## Error Handling

All endpoints may return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## CORS

The API is configured to accept requests from:
- `https://psec-ai.web.app`
- `http://psec-ai.web.app`
- `http://localhost:5173`
- `http://localhost:3000`

---

## Testing

### Using cURL

```bash
# Upload a report
curl -X POST http://localhost:5000/upload_report \
  -F "user_id=test_user" \
  -F "file=@test_report.pdf"

# Generate a report
curl -X POST http://localhost:5000/generate_report \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "prompt": "Create a test report"}'

# Get reports
curl http://localhost:5000/get_reports?user_id=test_user
```

### Using Postman

1. Import the endpoints into Postman
2. Set the base URL to `http://localhost:5000`
3. Create environment variables for `user_id` and other common values
4. Test each endpoint with appropriate request bodies

---

## Support

For API support or issues, please create an issue in the GitHub repository or contact the development team.

