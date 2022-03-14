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

const updateHospital = async (req, res = response) => {

    const hospitalID = req.params.id;
    const uid = req.uid;
    try{
        const hospitalDB = await HospitalModel.findById(hospitalID);

        if (!hospitalDB) {
          return  res.status(404).json({
                ok: false,
                msg: 'Este hospital no existe'
            });
        }

        const cambiosHospital = {
         ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await HospitalModel.findByIdAndUpdate(hospitalID, cambiosHospital, {new : true});

        res.json({
            ok: true,        
            hospital: hospitalActualizado
        })

    }
    catch(err){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador'
        })
    }


}
const deleteHospital = async (req, res = response) => {

    const hospitalID = req.params.id;

    try{
        const hospitalDB = await HospitalModel.findById(hospitalID);

        if (!hospitalDB) {
          return  res.status(404).json({
                ok: false,
                msg: 'Este hospital no existe'
            });
        }
   
        await HospitalModel.findByIdAndDelete(hospitalID)

        res.json({
            ok: true,        
            msg: 'El Hospital fue borrado'
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
    getHospitales,
    postHospital,
    updateHospital,
    deleteHospital
}