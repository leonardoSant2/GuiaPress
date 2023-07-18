const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Criando um relacionamento 1-P-N entre category e article. Category tem muitos articles
Category.hasMany(Article);
//Criando um relacionamento 1-P-1 entre article e category. Article pertence a 1 category
Article.belongsTo(Category);

//Article.sync({force: true});  

module.exports = Article;