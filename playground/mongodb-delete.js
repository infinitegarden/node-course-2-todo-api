// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'something to do'}).then((result) => {
    //     console.log(result);
    // });
    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Something to do'}).then((result) => {
    //     console.log(result);
    // });
    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    //deleteMany
    // db.collection('Users').deleteMany({name: 'Frieda'}).then((result) => {
    //     console.log(result);
    // });
    // // findOneAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID("59f3bcc868b399396f206e12")}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });



    //db.close();

});