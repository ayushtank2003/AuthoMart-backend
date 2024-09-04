const express=require('express');
const { 
    userSignupController, 
    userLoginController, 
    getUserDetailsController,
    authorize,
    updatePasswordController
} = require('../Controllers/UserController');
const UserRouter=express.Router();


UserRouter.post('/signUp',userSignupController);
UserRouter.post('/signIn',userLoginController);
UserRouter.get("/",authorize ,getUserDetailsController);
UserRouter.post("/changePassword",authorize, updatePasswordController)
module.exports=UserRouter;
