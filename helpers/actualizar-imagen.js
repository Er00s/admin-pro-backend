const fs = require('fs')

const Usuario = require('../models/usuario-model')
const Medico = require('../models/medico-model')
const Hospital = require('../models/hospital-model')

const borrarImagen = (path) =>{
    if(path != undefined){
        console.log(`borrando: ${path}`)
    }
    //chequea si existe el path en el sistema
    if(fs.existsSync( path ) ){
        //esto borra la imagen vieja
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) =>{

    let pathViejo = '';

    switch(tipo){
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                console.log('no es un usuario')               
                return false;
            }

             pathViejo = `./uploads/usuarios/${usuario.img}`; 

            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;

        case 'medicos': 
            const medico = await Medico.findById(id);
            if(!medico){
                console.log('no es un medico')
                return false;
            }

             pathViejo = `./uploads/medicos/${medico.img}`; 

            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;

        case 'hospitales': 
        const hospital = await Hospital.findById(id);
        if(!hospital){
            console.log('no es un hospital')
            return false;
        }

         pathViejo = `./uploads/hospitales/${hospital.img}`; 
        console.log(pathViejo);
        borrarImagen(pathViejo);

        hospital.img = nombreArchivo;
        await hospital.save();
        return true;
        break;
    }

}

module.exports = {
    actualizarImagen
}