require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
	// get the id
	var id = req.params.id;
	// validate the id -> not valid? return 404
  if (!ObjectID.isValid(id)){
  	return res.status(404).send();
  }
	// remove todo by id
	  // success
	    // if no doc, send 404
	    // if doc, send doc back with 200
	  // error
	    // 400 with empty body
  Todo.findByIdAndRemove(id).then((todo) => {
  	if (!todo) {
  		return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {
  	res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
	  if (!todo) {
	    return res.status(404).send();
    }
    res.send({todo});
	}).catch((e) => {
		res.status(400).send();
  });
})

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};
