
// Conectar as categorias com o banco de dados

const Sequelize = require('sequelize');

const connection = require('../database/database') // (..) para diretório anterior

// Definir model Category

const User = connection.define('users', {

    email: {
        
        type: Sequelize.STRING,
        allowNull: false
    },

    password: {

        type: Sequelize.STRING,
        allowNull: false
    }

})



module.exports = User;