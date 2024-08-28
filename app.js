const express = require("express");
const dotenv = require("dotenv");

const UserRouter = require("./Routers/UserRouter");
const { globalErrorHandlingController, unhandledRoutes } = require("./errorHandling/errorHandlingControllers");
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use('/user',UserRouter)


// Catch-all for undefined routes
app.all("*",unhandledRoutes);

// Global error handling middleware
app.use(globalErrorHandlingController);

module.exports = app;
