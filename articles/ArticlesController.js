
const express = require('express');
const router = express.Router();
const Article = require('../articles/Article');
const Category = require('../categories/Category');
const slugify = require('slugify');

// Autenticação de admin
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth,  (req,res)=>{                      // Plugar middleware na rota

    Article.findAll({
        include: [{model: Category}],                                       // Incluir model
    }).then(articles =>{
        res.render('admin/articles/index', { articles: articles })
    })
})

router.get('/admin/articles/new', adminAuth, (req, res)=>{

    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories: categories })
    })
})

router.post('/articles/save', adminAuth, (req,res)=>{

    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({

        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category

    }).then(()=>{
        res.redirect('/admin/articles')
    })  

})

router.post('/articles/delete', adminAuth, (req,res)=>{
    var id = req.body.id;
    if (id != undefined) {

        if ( !isNaN(id) ) {   // VERIFICAR SE É NUMÉRICO

            Article.destroy({    // Destruir categoria onde id for igual a id
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            })


        } else {
            res.redirect('/admin/articles')  // Redirecionar se não for numero
        }

    } else {
        res.redirect('/admin/articles')  // Redirecionar se for nulo
    }
})

router.post('/articles/edit/:id', adminAuth, (req, res) =>{

    var id = req.params.id;

    Article.findByPk(id).then(article =>{
        
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories})
            })
        
        } else {
        
            res.redirect('/')
        }
        
    }).catch(err =>{
    
        res.redirect('/')
    })

})

router.post('/articles/update', adminAuth, (req,res)=>{

    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category


    Article.update({ title: title, slug: slugify(title), body: body, categoryId: category },{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/articles')
    }).catch(err=> {
        res.redirect('/');
    })

})

router.get('/articles/page/:num', (req,res)=>{

    var page = req.params.num;

    if (isNaN(page) || page == 1) {

        offset = 0;
    } else {

        offset = (parseInt(page)- 1) * 4;
    }

    Article.findAndCountAll({       // Função de pegar todos + contar
        limit: 4,                   // limitar o retorno

        offset: offset ,            // offset faz com que a função retorne a partir do parametro desejado

        order: [
            ['id','DESC']
        ]


    }).then( articles =>{

        var next ;                  // verificar se existe próxima página
        
        if (offset + 4 >= articles.count) {              //articles.count só funciona por conta da função findAndCountAll

            next = false;
        } else {

            next = true;
        }


        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        
        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        })
        
    })
})



Article.sync({force: false})


module.exports = router;