require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate')

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	let todo = new Todo({
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

// GET /todos/1234564
app.get('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
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

app.delete('/todos/:id', authenticate, async (req, res) => {
	// get the id
	const id = req.params.id;
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
	try {
  	const todo = await Todo.findOneAndRemove({
		  _id: id,
		  _creator: req.user._id
  	});
  	if (!todo) {
  		return res.status(404).send();
	  }
	  res.send({todo});
	} catch (e) {
  	res.status(400).send();
	}

  // Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
  // 	if (!todo) {
  // 		return res.status(404).send()
  //   }
  //   res.send({todo});
  // }).catch((e) => {
  // 	res.status(400).send();
  // });
});

// TODO - convert to async/await
app.patch('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	try {
		const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
  // findOneAndUpdate
  // Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
	 //  if (!todo) {
	 //    return res.status(404).send();
  //   }
  //   res.send({todo});
  // }).catch((e) => {
		// res.status(400).send();
  // });
});

// POST /users
// TODO - Convert this one to async/await
app.post('/users', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}

	// user.save().then(() => {
	// 	// res.send(user);
	// 	return user.generateAuthToken();
	// }).then((token) => {
	//   res.header('x-auth', token).send(user);
	// }).catch((e) => {
	// 	res.status(400).send(e);
	// });
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const {email, password} = body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
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
