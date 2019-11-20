const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    /* return res.json({
         usuario: req.usuario,
         nombre: req.usuario.nombre,
         email: req.usuario.email
     });*/

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: false }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuario,
                    cuantos: conteo
                })

            });





        })



});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    //CREO OBJETO 

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    //INSERTO EN BD

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    //perimite seleccionar que campos actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {


    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuaioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    /* Usuario.findById(id, (err, usuarioBorrar) => {
         //si existe error en la consulat lo devuelve y para la app
         if (err) {
             return res.status(400).json({
                 ok: false,
                 err
             });
         };
         //lo paso a borrar preo primero verifico que exista

         if (!usuarioBorrar) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'Usuario no encontrado'
                 }
             });
         }
         //lo borro
         usuarioBorrar.remove(err => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     err: {
                         message: 'Usuario no encontrado'
                     }
                 });
             };
         })

         //devuelve el usuario borrado
         res.json({
             ok: true,
             usuario: usuarioBorrar
         });


     });*/

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuaioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuaioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuaioBorrado
        });
    });




});

module.exports = app;