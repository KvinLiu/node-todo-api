const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
// var length = hash.length;
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
// console.log(`Hash length: ${length}`);
//
// var data = {
// 	id: 4
// }
//
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somescret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash = token.hash) {
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed. Do not trust!');
// }
// const jwt = require('jsonwebtoken');
//
// var data = {
// 	id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);
var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 	  console.log(hash);
//   });
// })

var hashedPassword = '$2a$10$BLhCSacwwIIpvPqOtDIafexOqPzbKRo0X6iKAdptHNiKOggtiu.yi';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});
