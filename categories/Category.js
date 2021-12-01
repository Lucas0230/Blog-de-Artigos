
// Conectar as categorias com o banco de dados

const Sequelize = require('sequelize');

const connection = require('../database/database') // (..) para diretório anterior

// Definir model Category

const Category = connection.define('categories', {

    title: {
        
        type: Sequelize.STRING,
        allowNull: false
    },

    slug: {

        type: Sequelize.STRING,
        allowNull: false
    }

})


module.exports = Category;