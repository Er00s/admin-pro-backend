
const bcrypt = require("bcryptjs");
const { response } = require("express");
const { googleVerify } = require("../helpers/google-verify");
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


const googleSingIn= async (req, res = response) => {

    const googleToken = req.body.token;
    
    try {

        const {name,email,picture} = await googleVerify(googleToken)

        //verificar si el usuario existe
        const usuarioDB = await Usuario.findOne({email: email});
        let usuario;

        if(!usuarioDB){
            //no existe 
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            //existe
            usuario = usuarioDB;
            usuario.google = true;
           // usuario.password  = '@@@' si queremos dejar solo la autenticacion de google descomentamos esta linea
        }   

        //guardar en DB
        await usuario.save();

        
        const token = await generateJWT(usuarioDB.id, usuarioDB.nombre);
        
        res.json({
            ok:true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'Token no es correcto'
        });
    }

}


module.exports = {
    login,
    googleSingIn
}