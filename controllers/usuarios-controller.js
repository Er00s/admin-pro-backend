const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario-model");
const { generateJWT } = require("../helpers/jwt");

//CONSULTAR USUARIOS
const getUsuarios = async (request, response) => {

  //si no recibo un numero en la peticion voy a dar un 0 
  //http://localhost:3000/api/usuarios?desde=10
  const desde = Number(request.query.desde) || 0;
  const limit = (desde + 5);

  //coleccion de promesas para no disparar dos awaits simultaneos y no realentizar la aplicacion de manera innecesaria 
  //desestructuramos en un arreglo las promesas 
 const [usuarios, total ] = await Promise.all([
    // entre comillas simples son las propieades que se ven de el usuario
    Usuario  
        .find({}, "nombre email role google img")
        // saltaria los resultados desde el numero del desde en caso de ser 0 muestra los primeros 5 
        .skip(desde)
        .limit( limit ),
    //estas dos promesas separadas por la coma tienen un await heredado del promise.all
    Usuario.countDocuments()

  ])


  response.json({
    ok: true,
    mostrando: desde + ' hasta ' + (desde + limit - 1),
    total,
    usuarios
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
