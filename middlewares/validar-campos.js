const {response } = require('express')
const {validationResult} = require('express-validator');   

const validarCampos = (request, res = response, next) =>{

    const erroresMiddleWare = validationResult( request );
    if ( !erroresMiddleWare.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: erroresMiddleWare.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}