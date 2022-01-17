
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

//Inicializar el servidor express
const app = express();

//config cors
app.use(cors())

// BASE DE DATOS
dbConnection();

// mean_user
// Ldy6wqGbQxs9YyG8


// RUTAS
//funcion que se dispara cuando llaman a la raiz de nuestro proyecto en el navegador
// REQUEST: DATA DEL CLIENTE
// RESPONSE: LO QUE LE DA EL SERVIDOR
app.get( '/', (request, response) => {

    response.json({
        ok:true,
        msg: 'Bienvenido al server'
    });

} );

//PUERTO DE START
app.listen(process.env.PORT, ()=>{
    console.log(" Servidor corriendo en puerto " + process.env.PORT)
});
