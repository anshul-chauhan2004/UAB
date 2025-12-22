# UAB Institute Management System - React Edition

A modern, static React-based Institute Management System for The University of Alabama at Birmingham. Features comprehensive student/faculty dashboards, course management, authentication system, and dynamic announcements - all powered by client-side React with JSON data storage.

## 🚀 Major Features Added

### 1. **User Authentication System**
- Demo authentication (accepts any username/password)
- Role-based access stored in localStorage
- Protected routes with React Router
- Context API for authentication state management

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
- Static announcements from JSON data
- Categorized announcements (general, academic, event, urgent)
- Target audience filtering
- Date-based sorting

### 6. **Static Data Architecture**
- Client-side JSON files for all data
- No backend server required in production
- Fast loading and deployment
- Deployable to Vercel, Netlify, GitHub Pages

## 📁 Project Structure

```
UAB/
├── client/                 # React Frontend Application
│   ├── public/
│   │   ├── assets/        # Images and static media
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # Header, Footer, ProtectedRoute
│   │   ├── context/       # AuthContext (State Management)
│   │   ├── data/          # JSON data files (courses, departments, announcements)
│   │   ├── pages/         # All page components
│   │   ├── App.js         # Main app with React Router
│   │   └── index.js       # React entry point
│   ├── build/             # Production build output
│   └── package.json       # Client dependencies
├── server/                # Backend code (not used in production)
├── public/                # Legacy static assets
└── package.json           # Root dependencies
```

## 🛠️ Tech Stack

### Frontend (Client-Side Only):
- **React 19** - Modern UI library
- **React Router DOM v7** - Client-side routing and navigation
- **Context API** - Global state management for auth
- **CSS3** - Responsive styling with animations and transitions
- **LocalStorage** - Client-side data persistence
- **JSON Data Files** - Static data for courses, departments, and announcements

### Development:
- **React Scripts** - Build tooling and development server
- **React Testing Library** - Component testing utilities
- **Web Vitals** - Performance monitoring

**Note:** This is a static React SPA (Single Page Application) with no backend dependencies in production.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

**That's it!** No database or backend server required.

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UAB
```

### 2. Install Client Dependencies

```bash
cd client
npm install
```

### 3. Run the Application

**Development Mode:**

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

**Production Build:**

```bash
npm run build
```

This creates an optimized production build in the `build/` folder ready for deployment.

### 4. Deploy

Deploy the `build/` folder to any static hosting:

**Vercel:**
```bash
npm i -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
# Drag and drop build folder to Netlify
```

**GitHub Pages:**
```bash
npm install gh-pages --save-dev
# Add to package.json: "homepage": "https://username.github.io/repo-name"
npm run build
npx gh-pages -d build
```

## 🌐 Access Points

- **Development Server**: http://localhost:3000
- **Production Build**: Deployable to any static hosting platform

## 📁 Data Structure

All application data is stored in static JSON files:

### Courses Data (`client/src/data/courses.json`)
```json
[
  {
    "_id": "1",
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "department": "Computer Science",
    "description": "Course description...",
    "credits": 3,
    "instructor": "Dr. Smith",
    "schedule": { "days": ["Mon", "Wed"], "time": "10:00 AM - 11:30 AM" },
    "capacity": 30,
    "enrolled": 25
  }
]
```

### Departments Data (`client/src/data/departments.json`)
```json
[
  {
    "_id": "1",
    "name": "Computer Science",
    "code": "CS",
    "description": "Department description...",
    "head": "Dr. John Doe",
    "programs": ["BS Computer Science", "MS Software Engineering"]
  }
]
```

### Announcements Data (`client/src/data/announcements.json`)
```json
[
  {
    "_id": "1",
    "title": "Welcome to New Semester",
    "content": "Announcement content...",
    "type": "academic",
    "targetAudience": "all",
    "createdAt": "2025-01-15"
  }
]
```

## 📱 Application Pages

### Public Pages
- **Home** - Hero section, features, announcements, CTA
- **About** - University mission, vision, values, statistics
- **Courses** - Complete course catalog with search/filter (from JSON)
- **Departments** - All departments with details (from JSON)
- **Admissions** - Admission information and requirements
- **Campus Map** - Interactive campus map
- **Library** - Library resources and information
- **Career Services** - Career development resources
- **Contact** - Contact form and information
- **Gallery** - Campus image gallery
- **Portfolio** - Projects and achievements showcase
- **Login** - Demo authentication (accepts any credentials)
- **Register** - Demo registration (stores in localStorage)

### Protected Pages (Requires Authentication)
- **Dashboard** - Personalized student dashboard with 4 tabs:
  - Overview: Stats, announcements
  - My Courses: Enrolled courses with progress
  - Browse Courses: Available courses
  - Profile: User information management
- **Student Portal** - Additional student resources and tools

## 👥 User Roles

Demo authentication supports three role types (stored in localStorage):
- **student** (default) - Access to courses and dashboard
- **teacher** - Same access (for demonstration)
- **admin** - Same access (for demonstration)

**Note:** All authentication is client-side only for demonstration purposes.

## 🎨 UI/UX Features

- ✅ Fully responsive (mobile-first design)
- ✅ Modern card-based layouts
- ✅ Smooth animations and transitions
- ✅ Loading states with spinners
- ✅ Form validation
- ✅ Protected routes with authentication check
- ✅ Sticky navigation header
- ✅ Dynamic content based on user state
- ✅ Search and filter functionality
- ✅ Tab-based dashboard interface

## 🔒 Client-Side Features

- LocalStorage-based authentication state
- Protected routes with React Router
- Context API for global state management
- Demo user authentication (for presentation)
- Client-side form validation
- Responsive design with CSS3

**Note:** This is a demonstration application. For production use with real user data, implement proper backend authentication.

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

- [ ] Backend API integration (Node.js + MongoDB)
- [ ] Real authentication with JWT
- [ ] Grade management and GPA calculator
- [ ] Attendance tracking system
- [ ] Assignment submission portal
- [ ] Real-time messaging/chat with WebSockets
- [ ] Calendar integration with Google Calendar
- [ ] Email notifications
- [ ] File upload for course materials (AWS S3)
- [ ] Payment gateway for fees (Stripe)
- [ ] Advanced admin dashboard with analytics
- [ ] PDF report generation
- [ ] Progressive Web App (PWA) features
- [ ] Dark mode theme
- [ ] Multi-language support (i18n)

## 🐛 Troubleshooting

### Port Already in Use (Development)
```bash
# Find process on port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### React Dependencies Issues
```bash
cd client
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### LocalStorage Issues
```javascript
// Clear authentication data in browser console
localStorage.clear();
location.reload();
```

## 📄 Available Scripts (in client/ directory)

```json
{
  "start": "Start React development server (port 3000)",
  "build": "Create production build in build/ folder",
  "test": "Run React component tests",
  "eject": "Eject from Create React App (irreversible)"
}
```

## 📈 Performance Optimizations

- React.memo for component memoization
- Code splitting with React lazy loading
- Image optimization and lazy loading
- Debounced search functionality
- Efficient re-renders with React hooks
- Static JSON data for fast loading
- LocalStorage caching
- CSS animations with GPU acceleration
- Minified production builds

## 🧪 Testing

```bash
# Run React component tests
cd client
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
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
- Create React App team
- Open source contributors

---

**Note**: This is a static React SPA (Single Page Application) designed for demonstration and educational purposes. All authentication is client-side only. For production deployment with real user data, backend integration with proper security measures is recommended.

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