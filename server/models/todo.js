let mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}
});

module.exports = {Todo}