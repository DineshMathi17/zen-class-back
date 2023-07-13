const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10


const hashPasswords = async(password)=>{
    let salt = await bcrypt.genSalt(saltRounds)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

const hashCompare = async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}

const createToken = async(payload)=>{
    let token = await jwt.sign(payload,process.env.SECRETKEY,{expiresIn:'24h'})
    return token
}

 const authenticates=(req,res,next)=>{
    let decode = jwt.verify(req.headers.auth,process.env.JWT)
    if(decode){
    next();
    }
    else{
        res.json({message:'Unauthorized'})
    }
}
module.exports={ hashPasswords,hashCompare,createToken,authenticates}