// app.js

const express = require('express');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const { remplazaSlash, procesarImagenes } = require('./mover');

app.post("/procesar", (req, res) => {
    const iOrigen = req.body.origen;
    const iDestino = req.body.destino;

    if (!iOrigen || !iDestino) {
        res.sendFile(__dirname + "/index.html");
    } else {
        // Si los campos están llenos, realiza la operación aquí
        const sOrigen = remplazaSlash(iOrigen);
        const sDestino = remplazaSlash(iDestino);
        // Luego puedes llamar a tu función "procesarImagenes" y realizar las operaciones en el servidor
        procesarImagenes(sOrigen, sDestino);
        //res.send("Procesamiento exitoso");
    }
});

app.listen(3000, () => {
    console.log('Server en ejecución en puerto: ', 3000);
});
