const express=require('express');
const { 
    userSignupController, 
    userLoginController, 
    getUserDetailsController,
    authorize
} = require('../Controllers/UserController');
const UserRouter=express.Router();


UserRouter.post('/signUp',userSignupController);
UserRouter.post('/signIn',userLoginController);
UserRouter.get("/",authorize ,getUserDetailsController)
module.exports=UserRouter;
