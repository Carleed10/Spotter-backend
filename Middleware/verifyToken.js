const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    const secretKey = process.env.SECRET_KEY
    const authHeader = req.headers.authorization || req.headers.Authorization
    console.log(authHeader);
    if (!authHeader) {
        res.status(400).send({message : 'Authorisation not provided'})
        // console.log(error);
    }else if(!authHeader.startsWith("Bearer")){
        res.status(400).send({message : "Validation error"})
    }
    else{
        const token = authHeader.split(" ")[1] 
        console.log(token);
        jwt.verify(token, secretKey, (error, decode)=>{
            if (error) {
                res.status(400).send({message : "Error verifying token"})
            }
            else{
                console.log(decode.user);
                req.user = decode.user
                next()
            }
        })
    }
}


module.exports = verifyToken