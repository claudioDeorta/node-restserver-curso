const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('../models/usuario');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es nesesario'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true

    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es nesesario'],
    }


});

/*categoriaSchema.methods.toJOSON = function() {
    let user = this;
    let userObject = user.userObject();
    delete userObject.password;

    return userObject;
}*/
module.exports = mongoose.model('Categoria', categoriaSchema);