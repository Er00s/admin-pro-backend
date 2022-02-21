const { response } = require('express');
const MedicoModel = require('../models/medico-model');

const getMedicos = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'getMedicos'
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


const updateMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizar Medico'
    })
}
const deleteMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete Medico'
    })
}


module.exports = {
    getMedicos,
    postMedico,
    updateMedico,
    deleteMedico
}