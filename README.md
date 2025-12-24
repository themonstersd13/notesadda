NotesAdda - Engineering Resource Platform

NotesAdda is a modern, open-source collaborative platform designed for engineering students to share, organize, and access study materials effortlessly. Built with the MERN stack, it features AI assistance, cloud storage, and a personalized workspace.

Developed by: Saurabh Doiphode & Srushti Garad

🚀 Features

🎓 Core Features

Branch & Semester Organization: Structured drill-down navigation for CSE, IT, AI&ML, and more.

Dynamic Subject Management: Admins and contributors can dynamically add new subjects if they don't exist.

Global Search: Instantly find branches, semesters, or specific subjects using the smart search bar.

Cloud Storage: Secure upload and serving of PDFs and Images using Cloudinary.

🛠 My Desk Workspace

Drag-and-Drop Interface: Organize your study life with a Trello-like personal workspace.

Folders & Files: Create folders to group notes and upload personal files directly to your desk.

Persistence: Your workspace arrangement is saved locally, so you pick up where you left off.

🤖 Gemini AI Assistant

Context-Aware Chat: The AI knows which subject/branch you are viewing and answers questions relevant to that context.

Smart Summaries: Ask for summaries, formulas, or explanations of complex topics instantly.

👤 User Profiles

Profile Cards: Showcase your academic details, year of study, and bio.

Contribution Tracking: Track how many notes you've uploaded and the reactions (likes/dislikes) you've received.

Avatar Upload: Personalized profile pictures stored in the cloud.

🎨 UI/UX

Dark/Light Mode: Fully responsive theme switching.

Glassmorphism Design: Modern aesthetic with Tailwind CSS animations.

Responsive: Works perfectly on desktops, tablets, and mobile devices.

🏗 Tech Stack

Frontend:

React.js (Vite)

Tailwind CSS

Lucide React (Icons)

Axios & React Router DOM

Backend:

Node.js & Express.js

MongoDB (Mongoose)

JWT (JSON Web Tokens)

Cloudinary (File Storage)

Google Generative AI (Gemini)

⚙️ Installation & Setup

Prerequisites

Node.js (v16+)

MongoDB (Local or Atlas)

Cloudinary Account

Google AI Studio API Key

1. Backend Setup

Navigate to the backend folder:

cd notes-adda-backend


Install dependencies:

npm install


Create a .env file in notes-adda-backend/ and add the following:

PORT=5000
MONGO_URI=mongodb://localhost:27017/notes_adda  # Or your MongoDB Atlas String
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_google_gemini_key
FRONTEND_URL=http://localhost:3000


Start the backend server:

npm start
# or for development with auto-restart
npm run dev


2. Frontend Setup

Navigate to the frontend folder:

cd notes-adda-frontend


Install dependencies:

npm install


Start the frontend development server:

npm run dev


Open your browser and visit: http://localhost:3000

📂 Project Structure

NotesAdda/
├── notes-adda-backend/       # Server-side Code
│   ├── config/               # DB & Cloudinary Config
│   ├── controllers/          # Logic for Notes, Auth, AI, Profiles
│   ├── middleware/           # Auth & Admin protection
│   ├── models/               # Mongoose Schemas (User, Note, Profile)
│   ├── routes/               # API Endpoints
│   └── server.js             # Entry Point
│
└── notes-adda-frontend/      # Client-side Code
    ├── public/               # Static assets (Favicon)
    ├── src/
    │   ├── components/       # Reusable UI (Navbar, Footer, Cards)
    │   ├── views/            # Pages (Home, MyDesk, Profile, Upload)
    │   ├── services/         # API connection logic
    │   ├── data/             # Static constants
    │   ├── App.jsx           # Main Router Logic
    │   └── main.jsx          # Entry Point
    └── tailwind.config.js    # Styling Config


👥 Credits

Lead Developers:

Saurabh Doiphode

Srushti Garad

Walchand College of Engineering, Sangli.