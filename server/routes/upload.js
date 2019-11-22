const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');




//midelwere lo que se suba lo transforma en objeto file 
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se a seleccionado ningun archivo'
                }
            });
    }

    //validacion de tipos 

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son ' + tiposValidos.join(', ')
            }
        })

    }


    let archivo = req.files.archivo;

    //tomo valor de la extencion 

    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];
    //console.log(extencion);

    //Extenciones permitidas 

    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitiddas son ' + extencionesValidas.join(', ')
            }
        })
    }


    //cambiamos el nombre del archivo 
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extencion}`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aqui imagen cargada 

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }

        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            //borra si hay error
            borarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            //borra si hay error
            borarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Usuario no existe'
                }
            })

        }

        //llamado a funcion que borra archivo 

        borarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });



}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBd) => {

        if (err) {
            //borra si hay error
            borarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBd) {

            //borra si hay error
            borarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Producto no existe'
                }
            })

        }

        //llamado a funcion que borra archivo 

        borarArchivo(productoBd.img, 'productos');

        productoBd.img = nombreArchivo;

        productoBd.save((err, provedorGuardado) => {

            res.json({
                ok: true,
                provedor: provedorGuardado,
                img: nombreArchivo
            });

        });

    });

}

function borarArchivo(nommbreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nommbreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


};

module.exports = app;