const mongoose = require('mongoose');
const AppError = require("../errorHandling/AppErrors");
const { CatchAsync } = require("../errorHandling/utils");
const UserModel = require("../Models/UserModule");
const jwt = require('jsonwebtoken');
const util = require('util');
const sendMail=require("../utils/emailUtility");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

function signJWT(userid) {
    return jwt.sign(
        { id: userid },
        process.env.JWT_SECRET,
        {
            expiresIn: "90d"
        }
    );
}

exports.authorize = CatchAsync(async function (req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in!", 401));
    }

    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await UserModel.findById(decoded.id).select('+passwordChangeAt');
    
    if (!currentUser) {

    console.log(`User not found for ID: ${decoded.id}`);
        return next(new AppError("User not found!", 404));
    }

    if (currentUser.passwordChangeAfter(decoded.iat)) {
        return next(new AppError("Your password has changed, please log in again", 401));
    }
    
    req.userid = decoded.id;
    next();
});

exports.userSignupController = CatchAsync(async function (req, res, next) {
    const { firstName, email, password, passwordConfirm, role } = req.body;
    const user = await UserModel.create({
        firstName,
        email,
        password,
        passwordConfirm,
        role,
    });

    const token = signJWT(user._id);
    
    res.status(201).json({
        status: "success",
        token,
        user,
    });
});

exports.userLoginController = CatchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !(await user.isCorrectPassword(password))) {
        return next(new AppError("Invalid email or password", 401));
    }

    const token = signJWT(user._id);

    res.status(200).json({
        status: "success",
        token,
    });
});

exports.getUserDetailsController = CatchAsync(async function (req, res, next) {
    const { userid } = req;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userid)) {
        return next(new AppError("Invalid user ID", 400));
    }

    const user = await UserModel.findById(userid);
    if (!user) {
        return next(new AppError("User not found!", 404));
    }
    res.status(200).json({
        status: "success",
        user,
    });
});

exports.forgetPasswordController = CatchAsync(async function (req,res,next){
    const {email}=req.body;
    if (!email){
        return next(new AppError("Please enter your email ",400));
    }
    const User= await UserModel.findOne({email});
    if(!User){
        return next(new AppError("plz check your email!",404));
    }
    const resettoken= await User.createPasswordResetToken();
    await User.save({validateBeforesave: false});// required if you save the equals to operator to update the password field

    const emailOption={
        email:email,
        subject:"Your Pasword Reset Token",
        message:`Please find below your password reset token \n${resettoken}\n
        Remember to copy and paste this token into the password reset link in the password reset page. \n`
    };

    await sendMail(emailOption);
    res.status(200).json({
        status: "success",
        message: "Password reset token sent to your email",
    });

});

exports.resetPasswordController = CatchAsync(async function (req, res, next) {
    // Step 1:Verify the token
    const{email,token,newPassword, passwordConfirm } = req.body;
    const user= await UserModel.findOne({email});
    if (!user){
        return next(new AppError("User not found!", 404));
    }

    //Step 1.1 has the token is expired
    if (Date.now()>user.passwordResetExpiresAt){
        return next(new AppError("Token has expired",400));

    } 
    // Step 1.2 Token provided by usrer is valid or not
    if(! bcrypt.compare(token , user.passwordResetToken)){
        return next(new AppError("Invalid token ",401));
    }

    //Step 2 : Update the Password    
    if (newPassword !== passwordConfirm) {
        return next(new AppError("Passwords do not match", 400));
    }

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm; // This will be validated and cleared by the pre-save hook
    

    //Step 3: reset the passwordResetToken

    user.passwordResetToken=undefined;// Save to apply pre-save middleware
    user.passwordResetExpires=undefined; // Save to apply pre-save middleware

    await user.save(); 

    // Step 4:issue jwt token
    const Jwt_token = signJWT(user._id);

    // 5. Send response
    res.status(200).json({
        status: "success",
        user,
        Jwt_token ,
        message: "Password Reset successfully",
    });

});

exports.updatePasswordController = CatchAsync(async function (req, res, next) {
    
    const { email,currentPassword, newPassword, passwordConfirm } = req.body;

    // 1. Find the user by ID and include the password field
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError("User not found!", 404));
    }

    // 2. Check if the current password matches
    if (!(await user.isCorrectPassword(currentPassword))) {
        return next(new AppError("Your current password is incorrect", 401));
    }

    // 3. Validate new password and password confirmation
    if (newPassword !== passwordConfirm) {
        return next(new AppError("Passwords do not match", 400));
    }

    // 4. Update the password and passwordChangeAt field
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm; // This will be validated and cleared by the pre-save hook
    await user.save(); // Save to apply pre-save middleware

    
    const Jwt_token = signJWT(user._id);

    // 5. Send response
    res.status(200).json({
        status: "success",
        user,
        Jwt_token ,
        message: "Password changed successfully",
    });


});