const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');



router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
})

router.post("/admin/users/save", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10); //Aumenta a segurança do Hash gerado evitando gerar hash identico
    var hash = bcrypt.hashSync(password, salt);

    User.findOne({where:{email: email}}).then(user =>{
        if (user == undefined) {
            User.create ({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch(() => {
                res.redirect("/")
            });
        } else {
            res.redirect("/admin/users/create");
        }
    });
});

router.get("/admin/users/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/users");
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/users/edit", {user: user }) 
            
        } else {
            res.redirect("/admin/users")
        }
    }).catch(erro => {
        res.redirect("/admin/users")
    });
});

router.post("/admin/users/update", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var id = req.body.id;
    var salt = bcrypt.genSaltSync(10); //Aumenta a segurança do Hash gerado evitando gerar hash identico
    var hash = bcrypt.hashSync(password, salt);

    User.update({
        email: email,
        password: hash}, {
            where: {
                id: id
            }
        }).then(() => {
                res.redirect("/admin/users")
            }).catch(() => {
                res.redirect("/admin/users")
            });

});

router.post("/admin/users/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) { 
            User.destroy ({
                where: { 
                    id : id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        } else {
            res.redirect("/admin/users");
        }
    } else {
        res.redirect("/admin/users");
    }
});

router.get("/admin/login", (req, res) => {
    res.render("admin/users/login")
});

router.post("/authenticate", (req, res) => {
    
    var email = req.body.email;
    var password = req.body.password;
  
    User.findOne({where:{email:email}}).then(user => {
        if (user != undefined ) {
                //validar senha
                var correct = bcrypt.compareSync(password,user.password);
                if (correct) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }
                    res.redirect("/admin/articles");
                } else {
                    res.redirect('/admin/login');
                }
        } else {
            res.redirect("/admin/login")
        }
    })
  })

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})  
module.exports = router;

