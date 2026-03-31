# ♻️ PrelovedPH Marketplace

A sustainable marketplace for buying and selling pre-loved items in the Philippines, promoting circular economy and eco-friendly consumption.

**Note:** This is a full-stack marketplace platform demonstrating modern web development practices and sustainable e-commerce solutions.

---

## 🚀 Quick Start

### Prerequisites

Before getting started, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **npm** or **yarn** package manager
- **Supabase account** - [Sign up here](https://supabase.com)

### Installation

```bash
# Step 1: Clone the repository
git clone https://github.com/ThereseArcenal/prelovedph-marketplace.git

# Step 2: Navigate to the project directory
cd prelovedph-marketplace

# Step 3: Install backend dependencies
cd backend
npm install

# Step 4: Install frontend dependencies (new terminal)
cd frontend
npm install

# Step 5: Set up environment variables (see below)

# Step 6: Start the development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev



Database Setup (Supabase)
Step 1: Create a Supabase Project
Go to Supabase and create a new account or sign in

Click "New Project"

Fill in your project details:

Name: prelovedph-marketplace

Database Password: Create a strong password

Region: Asia-Pacific (Singapore) - closest to Philippines

Click "Create new project" (wait 2-3 minutes)

Step 2: Get Your API Keys
In your Supabase dashboard, go to Settings > API

Copy your Project URL (starts with https://...)

Copy your anon/public key (starts with eyJ...)

Copy your service_role key (for backend only, keep secret!)

Step 3: Set Up the Database Schema
In your Supabase dashboard, go to SQL Editor

Create a new query

Copy the entire content from backend/config/database.sql file

Paste it into the SQL Editor and click Run

Wait for the schema to be created (you should see "Success" message)

Step 4: Create Storage Bucket
In Supabase dashboard, go to Storage

Click "Create bucket"

Name: listings

Toggle "Public bucket" ON

Click "Create bucket"

Step 5: Configure Authentication
In Supabase dashboard, go to Authentication > Settings

Configure your site URL: http://localhost:3000 (for development)

Add any additional redirect URLs for production

Enable email confirmation (recommended)


Step 6: Environment Configuration
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (Required)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
APP_NAME=PrelovedPH
APP_URL=http://localhost:3000
API_URL=http://localhost:5000


Create a .env file in your frontend folder:
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=PrelovedPH
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development


📋 Required Dependencies
The following npm packages are required for Supabase integration:

Backend:
{
  "@supabase/supabase-js": "^2.38.0",
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5-lts.1"
}

Frontend:
{
  "@supabase/supabase-js": "^2.38.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.11.0"
}

🗄️ Database Schema Overview
The PrelovedPH platform uses the following main tables:

Table	Description
profiles	Extended user information (linked to Supabase Auth)
listings	Product listings with images, price, condition
messages	Buyer-seller communication threads
favorites	User saved/favorited listings
Security Features:

Row Level Security (RLS) policies enabled on all tables

User authentication required for creating listings

Only sellers can edit/delete their own listings

Public users can only view active listings


🏃‍♂️ Running the Application
Development Mode
Terminal 1 - Backend:

bash
cd backend
npm run dev
Server runs at: http://localhost:5000

Terminal 2 - Frontend:

bash
cd frontend
npm run dev
Application runs at: http://localhost:3000

Build for Production
bash
# Frontend only (backend stays as Node.js server)
cd frontend
npm run build
Preview Production Build
bash
cd frontend
npm run preview
🛠️ Technologies Used
This project is built with:

Category	Technology
Frontend Framework	React 18
Build Tool	Vite
Styling	Tailwind CSS
Icons	React Icons
HTTP Client	Axios
Backend Framework	Node.js + Express
Database	Supabase (PostgreSQL)
Authentication	Supabase Auth
Storage	Supabase Storage
File Upload	Multer
🎯 Features
For Buyers
✅ Browse verified listings with real-time updates

✅ Search and filter by category, condition, price

✅ Save favorites for later

✅ Contact sellers via platform messaging

✅ WhatsApp integration for quick communication

For Sellers
✅ Create listings with multiple photos

✅ Manage inventory (mark as sold, edit, delete)

✅ Respond to buyer inquiries

✅ Track listing views

General Features
✅ User authentication with email

✅ Responsive design (mobile-friendly)

✅ Real-time search and filters

✅ Image upload to Supabase Storage

✅ Clean, minimalist UI

🔒 Security Features
Feature	Description
Row Level Security (RLS)	Database-level access control
Authentication	Supabase Auth with email verification
Role-based Access	User and Admin roles
File Validation	Image type and size restrictions
API Rate Limiting	Prevents abuse
CORS Protection	Restricted API access
📁 Project Structure
text
prelovedph-marketplace/
├── backend/
│   ├── config/
│   │   ├── supabase.js          # Supabase client config
│   │   └── database.sql         # Database schema
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── listings.js          # Listing CRUD operations
│   │   ├── messages.js          # Messaging system
│   │   └── favorites.js         # Favorites management
│   ├── scripts/
│   │   └── createAdmin.js       # Admin creation script
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server entry
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── ListingCard.jsx  # Product card
│   │   │   ├── FilterSidebar.jsx# Search filters
│   │   │   └── Loader.jsx       # Loading spinner
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Listings.jsx     # Browse products
│   │   │   ├── ListingDetail.jsx# Product details
│   │   │   ├── CreateListing.jsx# Sell an item
│   │   │   ├── MyListings.jsx   # Manage listings
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Login.jsx        # Sign in
│   │   │   └── Register.jsx     # Sign up
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── utils/
│   │   │   ├── supabase.js      # Supabase client
│   │   │   └── api.js           # API service
│   │   ├── App.jsx              # Main app component
│   │   ├── index.jsx            # Entry point
│   │   └── index.css            # Global styles
│   ├── .env                     # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md
🎨 Pages Overview
Page	Route	Description
Home	/	Landing page with featured items
Browse	/listings	Browse and filter all items
Listing Detail	/listing/:id	View item details
Sell Item	/create-listing	List an item for sale
My Listings	/my-listings	Manage your listings
Profile	/profile	User profile settings
About	/about	About PrelovedPH
Login	/login	Sign in to account
Register	/register	Create new account
🔧 Available Scripts
Backend
Command	Description
npm run dev	Start development server with auto-reload
npm start	Start production server
Frontend
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build
🚀 Deployment
Deploy to Vercel (Frontend)
Push your code to GitHub

Go to Vercel and sign in with GitHub

Click "Add New Project"

Import your prelovedph-marketplace repository

Configure environment variables:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

VITE_API_URL

Click "Deploy"

Deploy Backend to Render/Railway
Push your code to GitHub

Go to Render or Railway

Create a new Web Service

Connect your GitHub repository

Set build command: npm install

Set start command: npm start

Add environment variables

Click "Deploy"

🤝 Contributing
Fork the repository

Create a feature branch: git checkout -b feature/your-feature

Make your changes and commit: git commit -m 'Add your feature'

Push to the branch: git push origin feature/your-feature

Submit a pull request

📧 Support
If you encounter any issues:

Check the console for error messages

Verify your environment variables are set correctly

Ensure your Supabase project is properly configured

Check that the database schema was applied successfully

🔗 Important Links
Resource	Link
Supabase	https://supabase.com
React	https://react.dev
Vite	https://vitejs.dev
Tailwind CSS	https://tailwindcss.com
Node.js	https://nodejs.org
📝 License
This project is part of a capstone project and is for educational purposes.

Built with ♻️ for sustainable living in the Philippines

Made with ❤️ by Therese Arcenal


