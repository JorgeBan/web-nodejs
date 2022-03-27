const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
require("dotenv").config();

const LoginRoutes = require('./routes/login')

const app = express()

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
  

app.set('views',__dirname+'/views')
app.engine('.hbs', engine({
    extname: '.hbs',
}))
app.set('view engine', 'hbs')
const port = 3000 || process.env.PORT

app.listen(port, () => console.log(`app listening on port ${port}!`))


app.use('/', LoginRoutes)
app.get('/', (req, res) => {
    if(req.session.loggedin) {
        res.render('home', { name: req.session.name } );
      } else {
        res.redirect('/login');
      }
})
