const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo.js');
const {User} = require ('./../server/models/user.js');

// var id = '5a00d62ce2a33caa52170f9911';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

var id = '59fb9becf13a7e91197ec31e';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

//User.findById
User.findById(id).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('user by Id', user);
}).catch((e) => console.log(e));

