const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  db = require('../Config/db');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

//user registration:

const register = async(req,res)=>{

    const{username,password} = req.body; //getting inputs from users
    const hashpassword = await bcrypt.hash(password,10)  //hashing

    //post data to DB
    db.run(
        `INSERT INTO users (username,password) VALUES (?,?)`,
        [username,hashpassword],
        function(err){
            if(err){
               console.log(err.message); 
            return res.status(500).json({message:"user exists already"})
        }
        res.json({id:this.lastID,username});  //after succesful registration it returns the user.
            }
    )


}

//user login

const userlogin = async(req,res)=>{

    const{username,password} = req.body;

    db.get(
        `SELECT * FROM users WHERE username=?`, [username],
        function(err,user){
            if(err || !user){
                return res.status(400).json({message:"Invalid username"})  //check the username is valid
            }

            const isValid =  bcrypt.compare(password,user.password);
            if(!isValid){
                return res.status(400).json({message:'invalid password'}) //check the password  is valid
            }

            const token = jwt.sign({id:user.id,username:user.username,role: user.role},SECRET_KEY,{expiresIn:"24h"}); //if both are valid creates a JWT token for login autheication and authorization
            res.json({
                message: "Login successful",
                token: token,
                role: user.role
            });

        }
    )



}


//user profile

const userProfile = async(req,res)=>{
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const userid = req.user.id;  //takes id of the user

    db.get(
        `SELECT id,username,credits,role FROM users WHERE id = ?`,[userid],  //query the DB to fin the id
        function(err,user){   
            if(err || !user){

                return res.status(404).json({message:"user not found"});  //if not found return err
                
            }
            res.json(user); //if found return the user
            
        }
    )
}

module.exports = {register,userlogin,userProfile};