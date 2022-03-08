const pathNode = require('path');
const fs = require('fs')

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const{ actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es u medico, hosital o usuario",
    });
  }

  //validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  // procesar la imagen
  const file = req.files.imagen;

  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //validar extensiones
  const extensionesValidas = ["jpg", "png", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "El formato de archivo no es valido",
    });
  }

  // generar nombre del archivo del
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  // path para guaradr la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // mv() mover la imagen
  file.mv(path, (err) => {
    if (err){
        console.log(err)
        return res.status(500).json({
            ok: false,
            msg: 'Error al mover la imagen'
        })
    } 

    // ACTUALIZAR BASE DE DATOS
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
        ok: true,
        msg: 'Archivo subido con exito',
        nombreArchivo
      });
  });

 
};
const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = pathNode.join(__dirname, `../uploads/${tipo}/${foto}`); 

  if(fs.existsSync(pathImg)){
    res.sendFile(pathImg);
  }else{
    const pathImg = pathNode.join(__dirname, `../uploads/no-image.png`); 
    res.sendFile(pathImg);
  }

}

module.exports = {
  fileUpload,
  retornaImagen
};
