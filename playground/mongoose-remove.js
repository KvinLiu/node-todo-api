const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '599a3edbba7b5019296630fc'}).then((todo) => {

})

Todo.findByIdAndRemove('599a3edbba7b5019296630fc').then((todo) => {
	console.log(todo)
});
