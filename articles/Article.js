
const Sequelize = require('sequelize');
const connection = require('../database/database');

// Relacionamento com o model Category

const Category = require('../categories/Category')

const Article = connection.define('articles', {

    title: {

        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {

        type: Sequelize.STRING,
        allowNull: false
    },
    body: {

        type: Sequelize.TEXT,
        allowNull: false
    }

})

Category.hasMany(Article); // (relacionamento 1 : N)
Article.belongsTo(Category); // Article pertence a category (relacionamento 1 : 1)


module.exports = Article;