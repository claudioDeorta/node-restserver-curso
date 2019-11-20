const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//==========================
//      Obtener Producto 
//==========================

app.get('/producto', verificaToken, (req, res) => {
    //trae todos los prodcutos 
    //populate:usuario , categorias
    //paginados 

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;
    limite = Number(limite);
    desde = Number(desde);

    Producto.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email').populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, prodcutoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                prodcuto: prodcutoDB
            })

        });

})

//==========================
//  Obtener un  Producto por id 
//==========================

app.get('/producto/:id', verificaToken, (req, res) => {
    //populate:usuario , categorias

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email').populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            //si existe error en la consulat lo devuelve y para la app
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto  no encontrado'
                    }
                });
            }

            return res.json({
                id: id,
                ok: true,
                prodcuto: productoDB
            });



        });

});

//==========================
//  Buscar producto  
//==========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //exprecion regular
    let regex = new RegExp(termino, 'i')


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            })

        })


});



//==========================
//  Crea un nuevo producto  
//==========================

app.post('/producto', verificaToken, (req, res) => {
    //saver que usuario 
    //salvar una categoria

    let body = req.body;

    let prodcuto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,

    });

    prodcuto.save((err, prodcutoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            prodcuto: prodcutoDB
        });

    });



})

//==========================
//  Actualizar un  producto  
//==========================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    //------------------------------------------------
    let nombre = body.nombre;
    let precioUni = body.precioUni;
    let descripcion = body.descripcion;
    let categoria = body.categoria;
    let usuario = req.usuario._id;

    // busco por id el producto


    Producto.findById(id)
        .populate('usuario', 'nombre email').populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            //si existe error en la consulat lo devuelve y para la app
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto  no encontrado'
                    }
                });
            }
            // cambios los parametros por los del body
            productoDB.descripcion = descripcion;
            productoDB.precioUni = precioUni;
            productoDB.categoria = categoria;
            productoDB.usuario = usuario;
            productoDB.nombre = nombre;



            //Guardo los cambios 
            productoDB.save((err, productoDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    productoDB
                });

            });

        });


});



//==========================
//  Borrar  un  producto por estado  
//==========================

app.delete('/producto/:id', verificaToken, (req, res) => {

    //disponible pasa a falso 

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email').populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            //si existe error en la consulat lo devuelve y para la app
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto  no encontrado'
                    }
                });
            }
            // cambios el parametro por falso 
            productoDB.disponible = false;
            //Guardo los cambios 
            productoDB.save((err, productoDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    productoDB
                });

            });

        });





})
module.exports = app;