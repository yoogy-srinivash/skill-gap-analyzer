# Skill Gap Analyzer

A comprehensive full-stack application designed to help professionals identify and bridge skill gaps in their career development. The platform analyzes user skills against role-specific requirements and provides actionable insights for professional growth.

## 🎯 Features

- **Role-Based Skill Analysis**: Compare your current skills against industry-standard requirements for 6+ professional roles
- **Resume Analysis**: Automatically extract and identify skills from resume text
- **Skill Gap Detection**: Get detailed analysis of missing skills and areas for improvement
- **Weighted Skill Importance**: Understand which skills are most critical for each role
- **Skill Categorization**: Skills organized by type (Language, Framework, Tool, Concept)
- **User Authentication**: Secure login and registration system
- **Personalized Dashboard**: View analysis results and track your skill development
- **Real-time Analysis**: Get instant feedback on your skill alignment with target roles

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with MySQL
- **Authentication**: JWT (JSON Web Tokens) with Argon2 password hashing
- **Additional**: Alembic for database migrations, CORS support
- **Python**: 3.10+

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18+ and npm 9+
- MySQL 8.0+ (for production)
- Git

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```
   DATABASE_URL=mysql+pymysql://user:password@localhost:3306/skill_gap
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ```

5. **Initialize the database**:
   ```bash
   alembic upgrade head
   ```

6. **Run the development server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 Usage Guide

### Getting Started

1. **Access the Application**: Open `http://localhost:5173` in your browser
2. **Create an Account**: Register with your email and password
3. **Log In**: Use your credentials to access the dashboard
4. **Select a Role**: Choose a target role from the available options
5. **Enter Your Skills**: Input your current skills or upload your resume for automatic skill extraction
6. **View Analysis**: Get detailed feedback on skill gaps and recommendations

### Supported Roles

- **Backend Developer**: Python, Django, REST API, SQL, Docker, and more
- **Frontend Developer**: HTML, CSS, JavaScript, React, TypeScript, and more
- **Data Analyst**: Python, SQL, Pandas, Power BI, Excel, and more
- **Machine Learning Engineer**: Python, TensorFlow, Scikit-learn, PyTorch, and more
- **DevOps Engineer**: Docker, Kubernetes, AWS, CI/CD, Linux, and more
- **Full Stack Developer**: Combination of front-end and back-end technologies

## 🏗️ Project Structure

```
skill-gap/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── auth.py              # Authentication routes and logic
│   │   ├── analyze.py           # Skill analysis logic
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   └── schemas.py           # Pydantic request/response schemas
│   ├── data/
│   │   ├── roles.json           # Role definitions and skill requirements
│   │   └── roadmap.json         # Learning roadmaps for each role
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── main.jsx             # Vite entry point
│   │   ├── api.js               # API client configuration
│   │   ├── components/          # Reusable React components
│   │   │   ├── MatchBar.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── SkillInput.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── assets/              # Static assets
│   ├── package.json             # Node.js dependencies
│   ├── vite.config.js           # Vite configuration
│   └── eslint.config.js         # ESLint configuration
│
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Authenticate and receive JWT token
- `GET /auth/me` - Get current user information (requires auth)

### Roles & Skills
- `GET /roles` - Get list of available roles
- `GET /roles/{role}/skills` - Get skills required for a specific role

### Analysis
- `POST /resume/extract` - Extract skills from resume text
- `POST /analyze` - Analyze skill gap for a target role

## 🔑 Key Components

### Resume Analysis
The application can parse resume text and automatically identify relevant skills, saving users time in manual data entry.

### Skill Matching Algorithm
Uses weighted scoring to match user skills against role requirements, providing a percentage match and identifying critical skill gaps.

### Learning Paths
Each role includes a recommended learning roadmap to help users prioritize skill development.

## 📊 Code Quality

**Backend**:
- Uses Pydantic for data validation
- Includes type hints throughout

**Frontend**:
```bash
npm run lint  # Run ESLint
npm run lint --fix  # Auto-fix linting issues
```

## 🗺️ Roadmap

- [ ] Integration with LinkedIn profile scraping
- [ ] AI-powered personalized learning recommendations
- [ ] Skill progress tracking over time
- [ ] Community skill sharing and mentorship matching
- [ ] Export analysis reports as PDF
- [ ] Mobile application
- [ ] Multi-language support

## 🎓 About

The Skill Gap Analyzer helps professionals take control of their career development by providing clear, actionable insights into their skills and opportunities for growth. Whether you're planning a career transition or looking to advance in your current field, this tool provides the data-driven guidance you need.

---

**Last Updated**: April 2026