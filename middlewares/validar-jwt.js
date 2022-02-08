const jwt = require("jsonwebtoken");


const validarJWT = (req,res,next) => {

    // LEER EL TOKEN
    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay TOKEN en la petición'
        });
    }
    try{
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        
        next();
    }
    catch(err){
        return res.status(401).json({
            ok:false,
            msg: 'TOKEN no válido'
        });
    }

  

}

module.exports = {
    validarJWT,

}