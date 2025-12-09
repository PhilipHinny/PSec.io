# PSec AI Development Guide

This guide is for developers who want to contribute to or extend the PSec AI project.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

## Development Setup

### Prerequisites

1. **Node.js** (v18+)
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Python** (3.11.8+)
   ```bash
   python --version  # Should be 3.11.8 or higher
   ```

3. **MongoDB**
   - Local MongoDB or MongoDB Atlas account
   - Connection string ready

4. **Firebase Account**
   - Project created
   - Authentication enabled
   - Firestore database created
   - Storage bucket created

5. **OpenRouter API Key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/psec-ai.git
   cd PSec.io
   ```

2. **Backend Setup**
   ```bash
   cd PSecAI-Server
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd PSecAI-Client
   npm install
   ```

4. **Environment Variables**
   - Create `.env` files as described in the main README
   - Ensure all API keys are configured

## Project Structure

### Frontend Architecture

```
PSecAI-Client/src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation header
│   ├── Sidebar.jsx      # Sidebar navigation
│   ├── Login.jsx        # Authentication modal
│   └── ...
├── pages/               # Route components
│   ├── Home.jsx         # Landing page
│   ├── Dashboard.jsx   # User dashboard
│   └── ...
├── styles/              # CSS modules
├── App.jsx              # Main app component with routing
├── main.jsx             # Entry point
└── apiConfig.js         # API configuration
```

**Key Patterns:**
- Components are functional with hooks
- CSS modules for styling
- Firebase for authentication and data
- React Router for navigation

### Backend Architecture

```
PSecAI-Server/
├── routes/              # Flask blueprints (API endpoints)
│   ├── upload_routes.py
│   ├── generate_routes.py
│   └── ...
├── services/            # Business logic
│   ├── ai_service.py    # AI integration
│   └── file_service.py  # File processing
├── db/                  # Database utilities
│   └── vector_db.py
├── app.py               # Flask app initialization
├── config.py            # Configuration
└── database.py          # MongoDB utilities
```

**Key Patterns:**
- Flask blueprints for route organization
- Service layer for business logic
- MongoDB for data persistence
- Async/await for AI API calls

## Development Workflow

### Starting Development Servers

**Terminal 1 - Backend:**
```bash
cd PSecAI-Server
python app.py
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd PSecAI-Client
npm run dev
# Frontend runs on http://localhost:5173
```

### Making Changes

1. **Frontend Changes:**
   - Vite has hot module replacement (HMR)
   - Changes reflect immediately in browser
   - Use browser DevTools for debugging

2. **Backend Changes:**
   - Restart Flask server after changes
   - Use Flask's debug mode for auto-reload:
     ```python
     app.run(debug=True, host="0.0.0.0", port=5000)
     ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

## Code Style Guidelines

### Frontend (React)

1. **Component Structure:**
   ```jsx
   import React, { useState, useEffect } from 'react';
   import './Component.css';

   const Component = ({ prop1, prop2 }) => {
     const [state, setState] = useState(null);

     useEffect(() => {
       // Side effects
     }, []);

     return (
       <div className="component">
         {/* JSX */}
       </div>
     );
   };

   export default Component;
   ```

2. **Naming Conventions:**
   - Components: PascalCase (`MyComponent.jsx`)
   - Files: Match component name
   - Functions: camelCase (`handleClick`)
   - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

3. **Props:**
   - Use destructuring for props
   - Define PropTypes or TypeScript types
   - Pass callbacks, not inline functions when possible

4. **State Management:**
   - Use `useState` for local state
   - Use `useEffect` for side effects
   - Consider Context API for shared state

### Backend (Python)

1. **Code Style:**
   - Follow PEP 8
   - Use type hints where possible
   - Maximum line length: 100 characters

2. **Function Structure:**
   ```python
   def function_name(param1: str, param2: int) -> dict:
       """
       Function description.
       
       Args:
           param1: Description
           param2: Description
           
       Returns:
           Description of return value
       """
       # Implementation
       return {}
   ```

3. **Blueprint Structure:**
   ```python
   from flask import Blueprint, request, jsonify

   blueprint_name = Blueprint("blueprint_name", __name__)

   @blueprint_name.route("/endpoint", methods=["POST"])
   def endpoint_function():
       try:
           data = request.json
           # Process request
           return jsonify({"result": "success"}), 200
       except Exception as e:
           return jsonify({"error": str(e)}), 500
   ```

4. **Error Handling:**
   - Always use try-except blocks
   - Return appropriate HTTP status codes
   - Log errors for debugging

## Testing

### Frontend Testing

```bash
# Run linter
cd PSecAI-Client
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Backend Testing

```bash
# Run Python tests (if test suite exists)
cd PSecAI-Server
python -m pytest

# Or manually test endpoints
python -c "from app import app; print('App loaded successfully')"
```

### Manual Testing Checklist

- [ ] User authentication (login/logout)
- [ ] File upload (PDF and DOCX)
- [ ] Report generation
- [ ] Report download
- [ ] Dashboard displays correctly
- [ ] Activity log updates
- [ ] Error handling works

## Debugging

### Frontend Debugging

1. **React DevTools:**
   - Install React DevTools browser extension
   - Inspect component state and props
   - Monitor component re-renders

2. **Browser Console:**
   ```javascript
   // Add console logs
   console.log('Debug:', variable);
   
   // Use debugger
   debugger; // Pauses execution
   ```

3. **Network Tab:**
   - Check API requests/responses
   - Verify CORS headers
   - Inspect request payloads

4. **Vite DevTools:**
   - Built-in error overlay
   - Fast refresh for quick iterations

### Backend Debugging

1. **Flask Debug Mode:**
   ```python
   if __name__ == "__main__":
       app.run(debug=True, host="0.0.0.0", port=5000)
   ```
   - Shows detailed error pages
   - Auto-reloads on code changes

2. **Print Debugging:**
   ```python
   print(f"[DEBUG] Variable value: {variable}")
   ```

3. **Logging:**
   ```python
   import logging
   logging.basicConfig(level=logging.DEBUG)
   logger = logging.getLogger(__name__)
   logger.debug("Debug message")
   ```

4. **MongoDB Compass:**
   - Visual database browser
   - Query and inspect collections

5. **Postman/Thunder Client:**
   - Test API endpoints
   - Verify request/response formats

### Common Debugging Scenarios

**Issue: CORS Error**
- Check CORS configuration in `app.py`
- Verify frontend URL is in allowed origins
- Check preflight OPTIONS requests

**Issue: Authentication Not Working**
- Verify Firebase config
- Check Firebase rules
- Inspect Firebase Auth tokens

**Issue: File Upload Fails**
- Check file size limits
- Verify file format (PDF/DOCX)
- Check MongoDB connection

**Issue: AI Generation Fails**
- Verify OpenRouter API key
- Check API rate limits
- Inspect request payload to AI service

## Common Issues

### Issue: Port Already in Use

```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill process
# Windows
taskkill /PID <pid> /F

# macOS/Linux
kill -9 <pid>
```

### Issue: MongoDB Connection Failed

- Check MongoDB URI format
- Verify network access (firewall, VPN)
- Check MongoDB Atlas IP whitelist
- Verify credentials

### Issue: npm Install Fails

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python Virtual Environment Issues

```bash
# Recreate virtual environment
deactivate  # If activated
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Firebase Authentication Errors

- Check Firebase project settings
- Verify API keys in `firebaseConfig.js`
- Check Firebase Authentication providers are enabled
- Verify Firestore rules

## Best Practices

### Frontend

1. **Component Organization:**
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

2. **Performance:**
   - Use `React.memo` for expensive components
   - Implement lazy loading for routes
   - Optimize images and assets

3. **State Management:**
   - Lift state up when needed
   - Use Context for global state
   - Consider Redux for complex state

4. **API Calls:**
   - Use axios for HTTP requests
   - Implement error handling
   - Show loading states
   - Handle network errors gracefully

5. **Security:**
   - Never expose API keys in client code
   - Validate user input
   - Sanitize data before display

### Backend

1. **Error Handling:**
   - Always catch exceptions
   - Return appropriate status codes
   - Log errors for debugging
   - Don't expose internal errors to clients

2. **Security:**
   - Validate all input
   - Sanitize file uploads
   - Use environment variables for secrets
   - Implement rate limiting

3. **Database:**
   - Use indexes for frequently queried fields
   - Implement connection pooling
   - Handle connection errors gracefully
   - Use transactions for critical operations

4. **API Design:**
   - Use RESTful conventions
   - Version your API if needed
   - Document endpoints
   - Return consistent response formats

5. **Performance:**
   - Use async/await for I/O operations
   - Cache frequently accessed data
   - Optimize database queries
   - Use pagination for large datasets

## Adding New Features

### Frontend Feature

1. Create component in `components/` or page in `pages/`
2. Add route in `App.jsx` if needed
3. Add styles in `styles/`
4. Update navigation if needed
5. Test thoroughly

### Backend Feature

1. Create route blueprint in `routes/`
2. Add business logic in `services/` if needed
3. Register blueprint in `app.py`
4. Update database schema if needed
5. Test endpoints

### Database Changes

1. Update schema documentation
2. Create migration script if needed
3. Update `database.py` utilities
4. Test with sample data

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Functions are well-documented
- [ ] Error handling is implemented
- [ ] No console.logs in production code
- [ ] No hardcoded values (use config/env)
- [ ] Security considerations addressed
- [ ] Performance optimizations considered
- [ ] Tests pass (if applicable)
- [ ] Documentation updated

## Resources

- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenRouter API Docs](https://openrouter.ai/docs)

## Getting Help

- Check existing GitHub issues
- Review code comments
- Ask in team chat/forum
- Create a detailed issue with:
  - What you're trying to do
  - What you've tried
  - Error messages
  - Environment details

---

Happy coding! 🚀

