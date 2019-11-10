require('./config/config');


const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Configuracion global de rutas
app.use(require('./routes/index'));




// CONESXION A BD

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
}, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(process.env.PORT, () => {
    console.log('Escucando el puerto ', process.env.PORT);
});
mongoose.set('useCreateIndex', true);