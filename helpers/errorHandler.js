async function errorHandler(err,req,res,next){
    
    if (err.name === "UnautorizedError"){
        return res.status(401).json({message:"Pengguna belum terotorisasi"});
    }

    if (err.name === "ValidationError"){
        return res.status(401).json({message:err})
    }

    return res.status(500).json(err);
}

export default errorHandler