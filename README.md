# UAB Institute Management System - React Edition

A full-stack React-based Institute Management System for The University of Alabama at Birmingham with authentication, course management, student dashboard, and comprehensive features.

## 🚀 Major Features Added

### 1. **User Authentication System**
- Registration with role-based access (student, teacher, admin)
- Secure login with JWT tokens
- Password encryption with bcrypt
- Protected routes and authorization

### 2. **Interactive Student Dashboard**
- Statistics overview (enrolled courses, GPA, credits)
- My Courses view with progress tracking
- Course browsing and enrollment functionality
- Profile management with editable fields
- Real-time announcements feed

### 3. **Advanced Course Management**
- Browse complete course catalog
- Filter by department
- Real-time search functionality
- Detailed course information (instructor, schedule, capacity)
- One-click enrollment system
- Capacity tracking

### 4. **Department Management**
- View all university departments
- Department details with faculty information
- Programs offered per department
- Contact information

### 5. **Announcements System**
- Real-time notifications
- Categorized announcements (general, academic, event, urgent)
- Target audience filtering
- Date-based sorting

## 📁 Project Structure

```
UAB/
├── client/                 # React Frontend (NEW)
│   ├── public/
│   └── src/
│       ├── components/    # Header, Footer, ProtectedRoute
│       ├── context/       # Auth Context (State Management)
│       ├── pages/         # Home, Dashboard, Courses, Login, Register, etc.
│       ├── App.js         # Main app with React Router
│       └── App.css        # Global styles
├── server/                # Express Backend (NEW)
│   ├── models/           # MongoDB models (User, Course, Department, Announcement)
│   ├── routes/           # API routes (auth, courses, departments, students)
│   └── index.js          # Server entry point with Express
├── public/               # Static assets (images, legacy HTML)
├── package.json          # Root dependencies
└── .env.example          # Environment configuration template
```

## 🛠️ Tech Stack

### Frontend:
- **React 18** - Modern UI library
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - Global state management
- **CSS3** - Responsive styling with animations

### Backend:
- **Node.js & Express.js** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Secure authentication tokens
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or Atlas)
- npm or yarn package manager

## ⚙️ Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uab-institute
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# MacOS with Homebrew
brew services start mongodb-community

# Or run MongoDB directly
mongod --dbpath /path/to/your/data/directory
```

### 4. Run the Application

**Development Mode (Recommended):**

```bash
# Runs both frontend and backend concurrently
npm run dev
```

**Or run separately:**

```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - React client
npm run client
```

**Production Build:**

```bash
npm run build
npm start
```

## 🌐 Access Points

- **React Frontend**: http://localhost:3000
- **Express Backend**: http://localhost:5000
- **API Base URL**: http://localhost:5000/api

## 🔑 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current authenticated user

### Courses (`/api/courses`)
- `GET /` - Get all courses (with optional filters)
- `GET /:id` - Get specific course
- `POST /` - Create new course (admin)
- `PUT /:id` - Update course
- `DELETE /:id` - Delete course
- `POST /:id/enroll` - Enroll in course

### Departments (`/api/departments`)
- `GET /` - Get all departments
- `GET /:id` - Get department details
- `POST /` - Create department

### Students (`/api/students`)
- `GET /:id` - Get student profile
- `PUT /:id` - Update student information

### Announcements (`/api/announcements`)
- `GET /` - Get active announcements
- `POST /` - Create announcement

## 📱 Application Pages

### Public Pages
- **Home** - Hero section, features, announcements, CTA
- **About** - University mission, vision, values, statistics
- **Courses** - Complete course catalog with search/filter
- **Departments** - All departments with details
- **Contact** - Contact form and information
- **Gallery** - Campus image gallery
- **Login** - User authentication
- **Register** - New user registration

### Protected Pages (Requires Authentication)
- **Dashboard** - Personalized student dashboard with 4 tabs:
  - Overview: Stats, announcements
  - My Courses: Enrolled courses with progress
  - Browse Courses: Available courses with enrollment
  - Profile: User information management

## 👥 User Roles

Three role types supported:
- **student** (default) - Access to courses, dashboard
- **teacher** - Course management capabilities
- **admin** - Full system access

## 🎨 UI/UX Features

- ✅ Fully responsive (mobile-first design)
- ✅ Modern card-based layouts
- ✅ Smooth animations and transitions
- ✅ Loading states with spinners
- ✅ Error handling with user-friendly messages
- ✅ Form validation
- ✅ Protected routes
- ✅ Sticky navigation header
- ✅ Dynamic content based on user state

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (salt rounds: 10)
- Protected API routes
- CORS configuration
- Environment variable management
- HTTP-only secure practices

## 📊 Database Models

### User Schema
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: student/teacher/admin),
  studentId: String (auto-generated),
  department: String,
  enrolledCourses: [ObjectId ref Course],
  createdAt: Date
}
```

### Course Schema
```javascript
{
  courseCode: String (required, unique),
  courseName: String (required),
  department: String (required),
  description: String,
  credits: Number (required),
  instructor: String,
  schedule: { days: [String], time: String },
  capacity: Number,
  enrolled: Number (default: 0),
  semester: String,
  prerequisites: [String],
  syllabus: String
}
```

### Department Schema
```javascript
{
  name: String (required, unique),
  code: String (required, unique),
  description: String,
  head: String,
  faculty: [{ name, position, email }],
  programs: [String],
  contactEmail: String,
  contactPhone: String,
  building: String
}
```

### Announcement Schema
```javascript
{
  title: String (required),
  content: String (required),
  type: String (enum: general/academic/event/urgent),
  targetAudience: String (enum: all/students/faculty/staff),
  author: ObjectId (ref User),
  isActive: Boolean (default: true),
  createdAt: Date,
  expiresAt: Date
}
```

## 🚧 Future Enhancements

- [ ] Grade management and GPA calculator
- [ ] Attendance tracking system
- [ ] Assignment submission portal
- [ ] Real-time messaging/chat
- [ ] Calendar integration with events
- [ ] Email notifications
- [ ] File upload for course materials
- [ ] Payment gateway for fees
- [ ] Advanced admin dashboard
- [ ] Reports and analytics
- [ ] Mobile app version

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB status
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### React Dependencies Issues
```bash
cd client
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Cannot Find Module Error
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
cd client && npm install && cd ..
```

## 📄 Scripts Reference

```json
{
  "dev": "Run frontend and backend concurrently",
  "server": "Run Express backend with nodemon",
  "client": "Run React development server",
  "build": "Build React app for production",
  "start": "Run production server"
}
```

## 📈 Performance Optimizations

- Code splitting with React lazy loading
- Image optimization
- Debounced search functionality
- Efficient re-renders with React hooks
- MongoDB indexing on frequently queried fields

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run client tests
cd client && npm test
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - Free to use for educational and commercial purposes.

## 🙏 Acknowledgments

- University of Alabama at Birmingham
- React.js community
- Express.js and MongoDB documentation
- Open source contributors

---

**Note**: This project has been completely transformed from a static HTML website into a full-stack React application with extensive backend functionality, authentication, and database integration.

- [Installation](#installation)
- [Usage](#usage)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Responsive Design**: Mobile-first approach with responsive layouts
- **Modern UI/UX**: Clean, professional design following UAB brand guidelines
- **Interactive Navigation**: Dropdown menus and mobile-responsive navigation
- **User Authentication**: Login and registration functionality
- **Multiple Pages**: Comprehensive website structure with various informational pages
- **Static File Server**: Built-in Node.js server for serving static content
- **Animations**: Smooth CSS animations and transitions
- **Brand Consistency**: UAB green color scheme throughout the site

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables and animations
- **JavaScript**: Interactive functionality
- **Google Fonts**: Open Sans typography

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Mongoose**: MongoDB object modeling
- **Body-parser**: Parse incoming request bodies
- **Multer**: Handle multipart/form-data

### Development Tools
- **Nodemon**: Development server with hot reload

## 📁 Project Structure

```
UAB/
├── about.html          # About page with university history and mission
├── contact.html        # Contact information and forms
├── departments.html    # Academic departments information
├── gallery.html        # Image gallery
├── index.html          # Homepage
├── login.html          # User login page
├── portfolio.html      # Portfolio/showcase page
├── register.html       # User registration page
├── script.js          # Client-side JavaScript
├── server.js          # Node.js server configuration
├── package.json       # Node.js dependencies and scripts
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (if using database features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anshul-chauhan2004/UAB.git
   cd UAB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

## 📖 Usage

### Starting the Server

The project includes a custom Node.js server that serves static files:

```bash
node server.js
```

The server will start on port 3000 and serve all HTML, CSS, and JavaScript files.

### Development Mode

For development with automatic restart on file changes:

```bash
npx nodemon server.js
```

## 📄 Pages

- **Home (`index.html`)**: Main landing page with university overview
- **About (`about.html`)**: Detailed information about UAB's history, mission, and values
- **Portfolio (`portfolio.html`)**: Showcase of university achievements and projects
- **Departments (`departments.html`)**: Academic departments and programs
- **Contact (`contact.html`)**: Contact information and inquiry forms
- **Gallery (`gallery.html`)**: Image gallery of campus and events
- **Login (`login.html`)**: User authentication page
- **Register (`register.html`)**: New user registration page

## 🔌 API Endpoints

### Authentication
- `POST /api/login`: User login endpoint
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "success": boolean }`

### Static Files
- `GET /`: Serves index.html
- `GET /*.html`: Serves respective HTML pages
- `GET /styles.css`: Serves CSS styles
- `GET /script.js`: Serves JavaScript files
- `GET /assets/*`: Serves image and media files

## 🎨 Design Features

### Color Scheme
- **UAB Green**: `#2F5233` (Primary)
- **UAB Light Green**: `#3D7041` (Secondary)
- **Dark Blue**: `#004a80` (Accent)
- **Light Blue**: `#eaf4fb` (Background)

### Typography
- **Font Family**: Open Sans (Google Fonts)
- **Weights**: 400, 600, 700

### Responsive Breakpoints
- Mobile: `max-width: 768px`
- Tablet: `768px - 1024px`
- Desktop: `1024px+`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support regarding this project:

- **Repository**: [UAB](https://github.com/anshul-chauhan2004/UAB)
- **Owner**: anshul-chauhan2004

## 📝 License

This project is licensed under the ISC License. See the `package.json` file for details.

## 🚧 Future Enhancements

- [ ] Database integration for dynamic content
- [ ] Content Management System (CMS)
- [ ] Enhanced user authentication with JWT
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Advanced form validation
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Unit and integration tests

---

**Note**: This is a demonstration website for the University of Alabama at Birmingham. For official UAB information, please visit the official UAB website.