const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido '
}


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es nesesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es nesesario'],
    },
    password: {
        type: String,
        required: [true, 'El password  es nesesario'],

    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        required: [true, 'El rol es nesesario'],
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJOSON = function() {
    let user = this;
    let userObject = user.userObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de der unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);