const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo.js');
const {User} = require ('./../server/models/user.js');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({
    _id : '5a00ec34efc3cfee58c17d3f'
}).then((todo) => {

});

var id = '5a00ec34efc3cfee58c17d3f';
Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo);
});