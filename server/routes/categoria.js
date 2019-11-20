const express = require('express');


let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==============================
//  Muestra todas las categorias 
//==============================

app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;
    limite = Number(limite);
    desde = Number(desde);


    Categoria.find({ estado: true }, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                categoria
            });


        })


});

//==============================
//  Muestra categoria por id
//==============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        //si existe error en la consulat lo devuelve y para la app
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        return res.json({
            id: id,
            ok: true,
            categoria: categoriaDB
        });



    });

});

//==============================
//  Crea una categoria
//==============================

app.post('/categoria', verificaToken, (req, res) => {


    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            categoria: categoriaDB
        });

    });

    // regeresa la nueva categoria 
    //req.usuario.id


});

//==============================
//  Actualisa una categoria 
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = body.descripcion;

    Categoria.findById(id, (err, categoriaDB) => {

        //si existe error en la consulat lo devuelve y para la app
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        categoriaDB.descripcion = descCategoria;

        categoriaDB.save((err, updateCategoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                categoriaDB: updateCategoriaDB
            });

        });

        /*  return res.json({
              id: id,
              ok: true,
              categoria: categoriaDB
          });*/



    });

});

//==============================
//  Borra una categoria
//==============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Solo un administrador puede borrar categoria 
    // Categoria.findByIdAndRemove
    let id = req.params.id;



    Categoria.findById(id, (err, categoriaDB) => {

        //si existe error en la consulat lo devuelve y para la app
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        //lo borro
        categoriaDB.remove(err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrado al borrar'
                    }
                });
            };

            return res.json({
                ok: true,
                categoria: categoriaDB,
                message: 'Borrado correctamente...'
            })
        })



    });

});


module.exports = app;