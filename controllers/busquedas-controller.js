const { response } = require("express");

const Usuario = require("../models/usuario-model");
const MedicoModel = require("../models/medico-model");
const HospitalModel = require("../models/hospital-model");

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    MedicoModel.find({ nombre: regex }),
    HospitalModel.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios,
    medicos,
    hospitales,
  });
};

const getDocumentosColeccion = async (req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, "i");

    let data;

    switch(tabla){
        case 'medicos':
            data = await MedicoModel.find({ nombre: regex })
                                         .populate('usuario','nombre img')                                        
                                         .populate('hospital','nombre img');
        break;

        case 'hospitales':
            data = await HospitalModel.find({ nombre: regex })
                                             .populate('usuario','nombre img');
            break;

        case 'usuarios':
           data = await Usuario.find({ nombre: regex });
         
            break;

        default:
            return res.status(400).json({
                ok:false,
                msg: 'La tabla debe ser usuarios/medicos/hospitales'
            });

            res.json({
                ok:true,
                resultados: data
            })
    }
    
      res.json({
        ok: true,
        resultados: data
      });
}

module.exports = {
  getTodo,
  getDocumentosColeccion
};
