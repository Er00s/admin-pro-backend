
const bcrypt = require("bcryptjs");
const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");

const Usuario = require("../models/usuario-model")

const login = async(req, res = response) => {

    const {email, password} = req.body;
    try {
        // VERIFICAR EMAIL 
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
         return res.status(404).json({
             ok: false,
             msg: 'email not found'
         });
        }

        //VERIFICAR CONTRASEÑA
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'password is incorrect'
            })
        }

        //GENERAR EL TOKEN

        const token = await generateJWT(usuarioDB.id, usuarioDB.nombre);


            res.json({
                ok:true,
                token: token
            })

    }

   
    catch (err) {
        console.log(err);
        res.status(500).json({ 
            ok: false,
            msg: 'hable con el administrador'
         });
    }
}

module.exports = {
    login
}