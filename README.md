# PayPilot

A personalized expense, bills, and payments tracker to help you manage your finances with ease! 💰

## Overview

PayPilot is a full-stack web application designed to help you track your expenses, manage bills, and monitor payments. Built with modern technologies, it provides a user-friendly interface for personal financial management.

## Architecture

This project consists of two main components:

- **Backend**: Spring Boot application with Oracle database support
- **Frontend**: React.js application with modern UI components

## Features

- 📊 Expense tracking and categorization
- 📧 Email notifications for bill reminders
- 🔐 Secure authentication with reCAPTCHA verification
- 📱 Responsive web interface
- 📈 Financial analytics and reporting
- 🔒 Password recovery via email

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Database**: Oracle (with H2 support for development)
- **Security**: Spring Security with reCAPTCHA
- **Email**: SMTP integration for notifications
- **Documentation**: Swagger/OpenAPI
- **PDF Generation**: iText library

### Frontend
- **Framework**: React 19.1.1
- **UI Library**: Bootstrap 5.3.7
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Toastify

## Quick Start

### Prerequisites

- Java 17+ (JDK)
- Node.js 16+ and npm
- Maven 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Excalibur02/PayPilot.git
   cd PayPilot
   ```

2. **Set up the backend**
   ```bash
   cd paypilot-backend
   mvn clean install
   mvn spring-boot:run
   ```
   
   > **Note**: Make sure to configure the `application.properties` file with your database, email, and reCAPTCHA settings before running the backend.

3. **Set up the frontend**
   ```bash
   cd ../paypilot-frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

## Configuration

The application requires configuration for:
- Database connection (Oracle or H2)
- SMTP settings for email functionality
- Google reCAPTCHA keys for security

See the [backend README](paypilot-backend/Readme.md) for detailed configuration instructions.

## Project Structure

```
PayPilot/
├── paypilot-backend/          # Spring Boot backend application
│   ├── src/                   # Java source code
│   ├── pom.xml               # Maven dependencies
│   └── Readme.md             # Backend-specific documentation
├── paypilot-frontend/         # React frontend application
│   ├── src/                   # React source code
│   ├── public/               # Static assets
│   ├── package.json          # npm dependencies
│   └── README.md             # Frontend-specific documentation
└── README.md                 # This file
```

## Documentation

- [Backend Setup Guide](paypilot-backend/Readme.md) - Detailed backend configuration and API documentation
- [Frontend Setup Guide](paypilot-frontend/README.md) - Frontend development and build instructions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please feel free to open an issue on GitHub.
