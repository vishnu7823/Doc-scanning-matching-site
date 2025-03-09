
//middleware for token auth
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const middleware = async(req,res,next)=>{
    try{
    const token = req.header('Authorization');
    if(!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({message:"access denied"});
    }

       const bearerToken= token.split(" ")[1];
        const decoded = jwt.verify(bearerToken.replace("Bearer",""),SECRET_KEY);
        req.user = decoded;
        next();

    }catch(err){
        console.log(err);
        res.status(400).json({message:"Invalid token"})
    
    }

}

module.exports = middleware;