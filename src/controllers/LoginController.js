const bcryptjs = require("bcryptjs");
const express = require('express')
const connection = require('../database/database')

function login(req, res){
    if(!req.session.loggedin){
        res.render('login/index')
    }else{
        res.redirect('/')
    }
}

function auth(req, res){
    const userData = req.body
    const selectQuery = 'SELECT * FROM users WHERE email = $1'
    connection.query(selectQuery, [userData.email], (err1, conn1) => {
        if(err1){
            res.render('login/index', { error: 'Error: hubo un problema con la conexion !' });
        }else{
            if(conn1.rowCount > 0){
                conn1.rows.forEach(element => {
                    bcryptjs.compare(userData.password, element.password, (err2, isMatch)=>{
                        if(!isMatch) {
                            res.render('login/index', { error: 'Error: Contraseña incorrecta !' });
                          } else {
                            
                            req.session.loggedin = true;
                            req.session.name = element.name;
              
                            res.redirect('/');
                          }
                    })
                })                
            }else{
                res.render('login/index', { error: 'Error: El usuario no existe !' });
            }
        }
    })

}



function register(req, res){
    if(!req.session.loggedin){
        res.render('login/register')
    }else{
        res.redirect('/')
    }
}
async function  storeUser(req, res) {
    const userData = req.body
    const passCrypt = await bcryptjs.hash(userData.password, 12)
    const text = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *'
    const values = [userData.name, userData.email, passCrypt]
    
    const selectQuery = 'SELECT * FROM users WHERE email = $1'
    connection.query(selectQuery, [userData.email], (err1, conn1)=>{
        if(err1){
            res.render('login/register', { error: 'Error: hubo un problema con la conexion !' });
        }else{
            if(conn1.rowCount > 0){
                res.render('login/register', { error: 'Error: El usuario ya existe !' });
            }else{
                connection.query(text, values, (err2, conn2) => {
                    if (err2) {
                      console.log(err2.stack)
                    } else {
                        conn2.rows.forEach(element => {
                            req.session.loggedin = true;
                            req.session.name = element.name;
                        })                   
                        res.redirect('/')  
                    }
                  })
            }
        }
    })
}

function logout(req, res) {
    if(req.session.loggedin == true) {
  
      req.session.destroy();
  
    }
    res.redirect('/login');
  }
  

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout
}