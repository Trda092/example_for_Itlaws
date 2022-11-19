const express = require('express');
const { authService, authPage } = require('./middlewares');
const session = require('express-session')
const db = require('./db.js');
const path = require('path');
const bodyParser = require('body-parser');
const os = require("os");
const port = 3000;
const app = express();
var tasks = ["config system", "base-line config", "manage-queue", "config system"]

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/component/login.html'))
});

app.post('/auth', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        db.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], function (err, result, fields) {
            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.role = result[0].role
                res.redirect('/home')
            } else {
                res.send('Incorrect Username and/or Password');
            }
            res.end();
        })
    } else {
        res.send("Please enter Username and Password");
        res.end();
    }
})

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/component/home.html'))
    } else {
        res.send("Please login to view this page")
    }
})

app.get('/access', (req, res) => {
    if (req.session.loggedin) {
        db.query("SELECT id FROM user WHERE username = ?", [req.session.username], function (err, result, fields) {
            res.send(tasks[result[0].id - 1])
            res.end();
        })
    } else {
        res.send("Please login to view this page")
    }
})

app.get('/accessAll', (req, res) => {
    if (req.session.loggedin) {
        if (req.session.role != "employee") {
            var tasksString = ''
            for (k = 0; k < tasks.length; k++) {
                tasksString += "task " + (k + 1) + ": " + tasks[k] + '<br/>'
            }
            res.send(tasksString)
        } else {
            res.status(403);
        }
        res.end();
    } else {
        res.send("Please enter Username and Password");
        res.end();
    }
})

app.get('/reject', (req, res) => {
    if (req.session.loggedin) {
        if (req.session.role == "ceo") {
            res.redirect('/rejectPage')
        } else {
            res.status(403);
        }
        res.end();
    } else {
        res.send("Please enter Username and Password");
        res.end();
    }
})

app.get('/rejectPage', (req, res) => {
    res.sendFile(path.join(__dirname + '/component/reject.html'))
})

app.post('/del', (req, res) => {
    var delname = req.body.username;
    var count = 0
    db.query("SELECT role FROM user WHERE username = ?",[delname], function (err, result, fields) {
    if (req.session.role == "ceo") {
        if (result[0].role != 'ceo'){
        db.query("SELECT * FROM user", function (err, result, fields) {
            count = result.length
        });
        db.query("DELETE FROM user WHERE username = ?", [delname], function (err, result, fields) {
            console.log(result)
        });
        db.query("SELECT * FROM user", function (err, result, fields) {
            if (result.length < count) {
                res.send(delname + " was rejected")
            } else {
                res.send("Don't have this user")
            }
            res.end();
        })}
    } else {
        res.status(403);
        res.send('Reject deny')
        res.end();
    }});
})
