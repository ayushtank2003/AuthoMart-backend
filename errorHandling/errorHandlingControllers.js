

const { handleJWTError, handleJWTExpiredError, sendErrDev, sendErrProd } = require("./utils");

exports.globalErrorHandlingController = (err, req, res, next) => {

    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();
    // Ensure statusCode is numeric
    err.statusCode = err.statusCode || 500; // Default to 500 for internal server error
    err.status = err.status || "error";
    err.message = err.message || "Internal server error";

    if (process.env.NODE_ENV === "production") {
        // logic production
        sendErrProd(err, res);
    } else {
        // developer
        sendErrDev(err, res);
    }

    // // Log the error details for debugging
    // console.error(`Error occurred: ${message} (Status: ${statusCode})`);

    // res.status(statusCode).json({
    //   status: status,
    //   message: message,
    // });
};

exports.unhandledRoutes=(req , res)=>{
    res.status(404).json({
        status: "error",
        message: `Can't find ${req.originalUrl} on this server`,
    });

}

