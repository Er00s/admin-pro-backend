const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario-model");
const res = require("express/lib/response");
const { generateJWT } = require("../helpers/jwt");

//CONSULTAR USUARIOS
const getUsuarios = async (request, response) => {
  // entre comillas simples son las propieades que se ven de el usuario
  const usuarios = await Usuario.find({}, "nombre email role google");

  response.json({
    ok: true,
    usuarios,
    uid: request.uid
  });
};

//CREAR USUARIOS
//RES === LA RESPUESTA QUE TENEMOS
//RESPONSE === EL TIPO DE EXPRESS
const postUsuario = async (request, res = response) => {
  const { email, password } = request.body;

  try {
    //TOMA EL EMAIL QUE VIENE EN EL request.body
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const usuario = new Usuario(request.body);

    // Encriptar contraseña
    //salt === data aleatoria que no conocemos el proceso que crea
    const salt = bcrypt.genSaltSync();
    //combinamos el pass con la data aleatoria
    usuario.password = bcrypt.hashSync(password, salt);
    
    //guardo el usuario
    await usuario.save();

    const token = await generateJWT(usuario.id, usuario.nombre);
    res.json({
      ok: true,
      usuario,
      token
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

//ACTUALIZAR USUARIOS
const updateUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    // TODO: Validar token y comprobar si es el usuario correcto

    // chequear si existe en la base
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese ID",
      });
    }

    //Actualizaciones
    //definimos y extraemos las lineas que no vamos a cambiar
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya está registrado",
        });
      }
    }

    campos.email = email;

    //le envio los campos sin el google y el password
    const userUpdate = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: userUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {

          // chequear si existe en la base
       const usuarioDB = await Usuario.findById(uid);
       if (!usuarioDB) {
         return res.status(404).json({
           ok: false,
           msg: "No existe un usuario por ese ID",
        });
    }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: "Usuario Eliminado"
          });
    }
   
      catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: "Error inesperado",
        });
      }
}

module.exports = {
  getUsuarios,
  postUsuario,
  updateUsuario,
  deleteUsuario,
};
