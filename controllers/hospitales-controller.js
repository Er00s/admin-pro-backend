const { response } = require('express');
const HospitalModel = require('../models/hospital-model');

const getHospitales = async (req, res = response) => {

    const hospitales = await HospitalModel.find()
                                          .populate('usuario','nombre img')

    res.json({
        ok: true,
        hospitales
    })


}

const postHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new HospitalModel({
        usuario: uid,
        ...req.body
    });


    try {

       const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const updateHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizar hospital'
    })
}
const deleteHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete hospital'
    })
}


module.exports = {
    getHospitales,
    postHospital,
    updateHospital,
    deleteHospital
}