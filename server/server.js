const config = require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser= require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo( {
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/1234567
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
        // 404 - send back empty send
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }
    
    // findById
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((e) => {
        // send empty body back
        res.status(400).send();
    });
});

// DELETE /todos/1234567

app.delete('/todos/:id', authenticate, async (req, res) => {
    // get the id
    const id = req.params.id;
    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});

    } catch(e) {
        // send empty body back
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
    // get the id
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate(
        {
            _id: id, _creator: req.user._id
        }, 
        {
            $set: body
        }, {
            new: true
        }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }).catch((e) => {
        // send empty body back
        res.status(400).send();
    });
    
});

// POST /users
app.post('/users', async (req, res) => {

    try {
        const body = _.pick(req.body, ['email', 'password']);   
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']); 
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};