

const express = require('express')

const router = express.Router();

const User = require('./User');  // Model

const bcrypt = require('bcryptjs'); // Hash para as senhas



router.get('/admin/users', (req, res)=>{
    
User.findAll().then((users)=>{
    res.render('admin/users/index', {users: users})
})

})

router.get('/admin/users/create', (req,res)=>{
    res.render('admin/users/create')
})

router.post('/users/create', (req, res)=>{


    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
        
    }).then( user => {

        if (user == undefined) {                        // verificar se o email existe


            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);         // 'Encriptografar' a senha

            User.create({

                email: email,
                password: hash                            // <<<
    
        
            }).then(()=>{
                res.redirect('/')

            }).catch( err =>{

                res.redirect('/')
            })


        } else {

            res.redirect('/admin/users/create');
        }
    })


    

})


router.get('/login', (req,res)=>{
    res.render('admin/users/login')
})

router.post('/authenticate', (req,res)=>{

    var email = req.body.email;
    var password = req.body.password; 

    User.findOne({

        where: {email:email} 
    
    }).then( user => {

        if (user != undefined) {            // Se tiver usuario 

            //Validar senha

            var correct = bcrypt.compareSync(password, user.password);    // Comparar senha do form com o do database

            if (correct) {

                req.session.user = {            // Criar sessão de login

                    id: user.id,
                    email: user.email
                }

                res.redirect('/admin/articles')

            } else {

                res.redirect('/login')
            }

        } else {

            res.redirect('/login')
        }


    })


})


router.get('/logout', (req,res)=>{

    req.session.user = undefined;
    res.redirect('/')

})


module.exports = router;

