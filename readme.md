
## Table of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

This project is a comprehensive web application designed to manage products and users. It includes functionality for user authentication, product management, error handling, and API feature enhancements such as filtering, sorting, pagination, and field limiting.

### Key Features

- User signup, login, and authorization
- Product creation, fetching, filtering, sorting, and pagination
- Secure user password management with reset and update options
- Error handling with custom error messages and structured error responses
- Email notifications using NodeMailer

## Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) for authentication
- [Nodemailer](https://nodemailer.com/) for email notifications

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js and npm installed on your local machine
- MongoDB database (either local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/ayushtank2003/AuthoMart-backend.git

2. Navigate to the project directory:
    cd AuthoMart-backend

3. Install NPM packages
    npm install

4. Set up environment variables. Create a .env file in the root directory and add the following:

    - PORT=2345
    - DB_URL=mongodb+srv://username:<password>@cluster0.lqes229.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    - DB_PASSWORD=password
    - SECRET=secretKey
    - JWT_SECRET=your_jwt_secret
    - Email_Host=smtp.your-email-provider.com
    - Email_Port=587
    - Email_UserName=your-email@example.com
    - Email_Password=your-email-password

## usage

Use the API endpoints to manage products and users.
To authenticate, use the signup and login routes to obtain a JWT.
Include the JWT in the Authorization header as Bearer <token> to access protected routes.

## api-documentation

1. Product Endpoints
    - POST /api/products - Create a new product
    - GET /api/products - Fetch all products with filtering, sorting, pagination, and field limiting


2. User Endpoints
    - POST /api/users/signup - Register a new user
    - POST /api/users/login - Log in a user and receive a JWT
    - GET /api/users/me - Get details of the authenticated user
    - POST /api/users/forgot-password - Request a password reset token
    - POST /api/users/reset-password - Reset password using the token
    - PATCH /api/users/update-password - Update the user's password

## Error Handling

Error handling is managed through a centralized error handling controller that processes different types of errors, including JWT errors and other operational errors. Errors are returned in a structured JSON format.

## Features

    - Advanced Filtering: Filter products based on various attributes.
    - Sorting: Sort products by specified fields.
    - Pagination: Efficient pagination of large datasets.
    - Field Limiting: Control the fields returned in API responses.
    - JWT Authentication: Secure endpoints with JWT-based authentication.
    - Email Notifications: Send email notifications for actions like     password resets.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

    - Fork the Project
    - Create your Feature Branch (git checkout -b feature/AmazingFeature)
    - Commit your Changes (git commit -m 'Add some AmazingFeature')
    - Push to the Branch (git push origin feature/AmazingFeature)
    - Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information

## Contact

    Ayush Kumar Tank - LinkedIn url https://www.linkedin.com/in/ayush-kumar-tank-192918256/



Replace placeholders such as `your-username`, `your-repo-name`, `<password>`, `your_jwt_secret`, and `your-email@example.com` with the actual values relevant to your project. Let me know if you need further customization or details added!




