const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// let id = '59993b76ddfba342a04e8d3a11';
//
// if (!ObjectID.isValid(id)){
// 	console.log('ID not valid');
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });
//
// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todos', todo);
// })

// Todo.findById(id)
// 	.then((todo) => {
// 	if (!todo) {
// 		return console.log('Id not found');
//   }
// 	console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

let user_id = '5995abb338ac79219ec808f5';

User.findById(user_id)
	.then((user) => {
	if (!user) {
		return console.log('User not found')
  }
  console.log('User By Id', user);
}).catch((e) => console.log(e));