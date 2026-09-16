# Resume Analyzer

Resume Analyzer is a full-stack interview preparation app. Users can create an account, upload a resume, add a job description, and generate an AI-powered interview report with questions, skill gaps, and a preparation roadmap.

## Project Structure

```text
backend/   Express API, MongoDB, Gemini AI, PDF generation
frontend/  React and Vite user interface
```

## Requirements

- Node.js 18 or newer
- MongoDB database
- Google Gemini API key
- A PDF resume for report generation

The JavaScript package requirements are maintained in:

```text
backend/package.json
frontend/package.json
```

## Environment Setup

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Keep `.env` private and never commit real credentials to Git.

## Install Dependencies

Open a terminal in the project root and install dependencies for both applications:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Run Both Applications

Run the backend and frontend in two separate terminals. Both applications use the `npm run dev` command.

### Terminal 1: Backend

```powershell
cd D:\practice\Genai\backend
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

### Terminal 2: Frontend

```powershell
cd D:\practice\Genai\frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## Main User Flow

1. Register or log in.
2. Enter a job description.
3. Upload a PDF resume.
4. Add a self-description.
5. Click **Generate Interview Report**.
6. Review technical questions, behavioral questions, skill gaps, and the preparation roadmap.
7. Download an AI-generated resume PDF from a saved report.

## Main Technologies and Packages

### Backend

- **Express**: Creates the API server and routes.
- **Mongoose**: Connects to MongoDB and defines user and interview-report schemas.
- **Google GenAI**: Generates interview reports and resume HTML content.
- **Zod**: Defines and validates the expected AI response structure.
- **zod-to-json-schema**: Converts Zod schemas into JSON schemas for Gemini structured output.
- **pdf-parse**: Extracts text from uploaded PDF resumes.
- **Puppeteer**: Converts AI-generated resume HTML into a downloadable PDF.
- **Multer**: Receives uploaded resume files in memory.
- **bcryptjs**: Hashes user passwords before storing them.
- **jsonwebtoken**: Creates and verifies login JWTs.
- **cookie-parser**: Reads authentication cookies from requests.
- **dotenv**: Loads backend environment variables from `.env`.
- **CORS**: Allows the frontend to communicate with the backend.

### Frontend

- **React**: Builds the user interface.
- **React Router**: Handles login, home, and interview-report routes.
- **Axios**: Sends authentication, report, and PDF requests to the backend.
- **Sass**: Provides SCSS styling for the application screens.
- **Vite**: Runs the frontend development server and production build.

## Frontend Commands

Run these commands from `frontend/`:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Command

Run this command from `backend/`:

```powershell
npm run dev
```

## API Overview

The backend exposes these main route groups:

```text
/api/auth       Registration, login, logout, and current-user access
/api/interview  Report generation, report listing, report details, and resume PDF generation
```

The frontend communicates with the backend at `http://localhost:3000` and uses credentialed cookies for authentication.

## Notes

- Start MongoDB and make sure `MONGO_URI` is valid before generating reports.
- The Gemini API is used for interview reports and resume content generation.
- Puppeteer converts generated resume HTML into a PDF.
- Do not expose API keys, database passwords, or JWT secrets in frontend files or source control.
