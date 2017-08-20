let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text
	});
	todo.save().then((doc) => {
		res.send(doc);
		}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
}, (e) => {
		res.status(400).send(e);
});
});

// GET /todos/1234564
app.get('/todos/:id', (req, res) => {
	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if (!todo) {
	    return res.status(404).send()
    }
    res.send({todo});
	}).catch((e) => {
		res.status(400).send();
})

	// if (ObjectID.isValid(id)) {
	// 	Todo.findById(id).then((todo) => {
	// 		res.send(todo);
	// 	}, (e) => {
	// 		res.status(404).send({})
	// 	})
	// } else {
	// 	res.status(404).send({});
	// }
	// Valid id using isValid
    // 404 - send back empty send
  // findById
    // success
      // if todo - send it back
      // if not todo - send back 404 with empty body
    // error
     // 400 - and send empty body back
}, (e) => { res.status(400).send(e)});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app};