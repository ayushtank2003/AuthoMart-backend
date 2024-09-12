const express=require('express');
const { 
    userSignupController, 
    userLoginController, 
    getUserDetailsController,
    authorize,
    updatePasswordController,
    forgetPasswordController,
    resetPasswordController
} = require('../Controllers/UserController');
const UserRouter=express.Router();


UserRouter.post('/signUp',userSignupController);
UserRouter.post('/signIn',userLoginController);
UserRouter.get("/",authorize ,getUserDetailsController);
UserRouter.post("/forgetPassword", forgetPasswordController);
UserRouter.post("/resetPassword", resetPasswordController);
UserRouter.post("/changePassword",authorize, updatePasswordController);
module.exports=UserRouter;
