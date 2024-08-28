const AppError = require("./AppErrors");

exports.CatchAsync = (fn)  => {
    return async (req, res, next) => {
        try{
            await fn(req, res, next);
        }catch(err){
            next(err);// this will handel programitical error  || internal server error 
            return;
        }
    };
};



exports.sendErrDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack,
    });
};


exports.sendErrProd=(err,res)=>{
    if(err.statusCode==500){//prog error want to hide this
        res.status(500).json({
            status:err.status,
            message:"oh something bad happened",
        });
        return;
    }else{//operational err want to show this to user
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
        });
    }
};

exports.handleJWTError=()=>
    new AppError('invalid token,please log in again',401);
exports.handleJWTExpiredError=()=>
    new AppError("token Expired ! please log in again",401);
  