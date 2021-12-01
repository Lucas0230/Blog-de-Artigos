const express = require('express');
const app = express();

const connection = require('./database/database');

// Criar sessões para o login
const session = require('express-session');

// Pegar rotas de outro arquivo
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UsersController')

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');

app.set('view engine', 'ejs');

// Sessions

app.use(session({
    secret:'aleatorio',
    cookie: { maxAge: 30000000 }       // milisegundos
}))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection.authenticate()
    .then(()=>{console.log('conexão com o database ok!')})
    .catch(()=>{console.log('erro no database!')})

app.use('/', categoriesController);  // Usar categoriesControleer para as rotas 
//                                   // Barra (/) é o prefixo dessas rotas
app.use('/', articlesController);

app.use('/', usersController);

app.use(express.static(__dirname + '/public'));


//Rota principal

app.get('/', (req, res)=>{
    
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })

})


app.get('/:slug', (req, res)=>{
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug:slug
        }
    
    }).then(article =>{
        
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories})
            })
        
        } else {
        
            res.redirect('/')
        }
        
    }).catch(err =>{
    
        res.redirect('/')
    })  
})


app.get('/category/:slug', (req, res)=>{

    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        } , 
        include: [{model: Article}]

    }).then(category => {

        if (category != undefined) {
            
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })

        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})



app.listen(3030, ()=>{

    console.log('Servidor ligado 3030!')
})


// console.log(slug);


