const { response } = require('express');
const MedicoModel = require('../models/medico-model');

const getMedicos = async (req, res = response) => {

    const medicos = await MedicoModel.find()
                                          .populate('usuario','nombre img')
                                          .populate('hospital','nombre img')
    res.json({
        ok: true,
        medicos
    })

}



const postMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new MedicoModel({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const updateMedico = async (req, res = response) => {

    const medicoID = req.params.id;
    const uid = req.uid;
    try{
        const medicoDB = await MedicoModel.findById(medicoID);

        if (!medicoDB) {
          return  res.status(404).json({
                ok: false,
                msg: 'Este Medico no existe'
            });
        }

        const cambiosMedico = {
         ...req.body,
            usuario: uid
        }

        const medicoActualizado = await MedicoModel.findByIdAndUpdate(medicoID, cambiosMedico, {new : true});

        res.json({
            ok: true,        
            hospital: medicoActualizado
        })

    }
    catch(err){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador'
        })
    }
}
const deleteMedico = async (req, res = response) => {
    const medicoID = req.params.id;

    try{
        const medicoDB = await MedicoModel.findById(medicoID);

        if (!medicoDB) {
          return  res.status(404).json({
                ok: false,
                msg: 'Este medico no existe'
            });
        }
   
        await MedicoModel.findByIdAndDelete(medicoID)

        res.json({
            ok: true,        
            msg: 'El Medico fue borrado'
        })

    }
    catch(err){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador'
        })
    }
}


module.exports = {
    getMedicos,
    postMedico,
    updateMedico,
    deleteMedico
}