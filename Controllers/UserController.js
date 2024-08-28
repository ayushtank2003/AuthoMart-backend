const AppError=require("../errorHandling/AppErrors");
const { CatchAsync } = require("../errorHandling/utils");
const UserModel = require("../Models/UserModule");
const jwt=require('jsonwebtoken');
const util=require('util');

function signJWT(userid){
    return jwt.sign(
        {id:userid},
        process.env.JWT_SECRET,
        {
            expiresIn:"90d"
        }
    ) ;
};

exports.authorize=CatchAsync(async function (req,res,next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        token=req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new AppError("You are not loggeed in !",401));

    }
    const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET );
    req.userid=decoded.id;
    next();
})


exports.userSignupController=CatchAsync (async function (req,res,next) {
    const{firstName,email,password,passwordConfirm,role}=req.body;
    const user=await UserModel.create({
        firstName,
        email,
        password,
        passwordConfirm,
        role,
    });

    const token=signJWT(user._id);
    
    res.status(201).json({
        status:"success",
        token,
        user:user,
    });
    
});

exports.userLoginController=CatchAsync(async function (req,res,next) {
    const {email,password}=req.body;
    if(!email||!password){
        next(new AppError("please provide email and password",400));
        return;
    }
    const user=await UserModel.findOne({email}).select("+password");//provide password as well along with other details 

    if(!user ||!(await user.isCorrectPassword(password))){
        next(new AppError("Invalid email or password",401));
        return;
    }
    
    const token=signJWT(user._id);

    res.status(201).json({
        status:"success",
        token,
    });
});

exports.getUserDetailsController=CatchAsync(async function (req,res,next) {
    const {userid}=req;
    const user = await UserModel.findById(userid);
    if(!user){
        return next(new AppError("User not found!",404));
    }
    res.status(201).json({
        status:"success",
        user,
    });
});