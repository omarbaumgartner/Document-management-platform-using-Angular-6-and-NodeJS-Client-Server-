const db = require('../config/db.config.js');
const User = db.users;

// Post an User
exports.create = (req, res) => {
	// Save to PostgreSQL database
	User.create({
		"firstname": req.body.firstname,
		"lastname": req.body.lastname,
		"role": req.body.role,
		"email": req.body.email,
		"password": req.body.password,
		"token": "token"
	}).then(user => {
		// Send created user to client
		res.json(user);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// FETCH All Users
exports.findAll = (req, res) => {
	User.findAll().then(users => {
		// Send All users to Client
		res.json(users.sort(function (c1, c2) { return c1.id - c2.id }));
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Find an User by Id
exports.findByPk = (req, res) => {
	User.findByPk(req.params.id).then(user => {
		res.json(user);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

//Test : Find an User by Email
exports.findByEmail = (req, res) => {
	User.findByEmail(req.params.email).then(user => {
		res.json(user);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Update an User
exports.update = (req, res) => {
	const id = req.body.id;
	User.update(req.body,
		{ where: { id: id } }).then(() => {
			res.status(200).json({ mgs: "Updated Successfully -> User Id = " + id });
		}).catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Delete an User by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	User.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).json({ msg: 'Deleted Successfully -> User Id = ' + id });
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};