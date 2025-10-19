# UAB - University of Alabama at Birmingham Website

A modern, responsive website for the University of Alabama at Birmingham featuring a clean design with UAB's brand colors and comprehensive information about the university.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
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