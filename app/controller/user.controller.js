const userService = require('../services/user.service');


// Post a User
exports.createUser = (req, res) => {
	// Save to PostgreSQL database
	userService.createUser(req, res)
		.then(user => {
			// Send created user to client
			res.json(user);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// FETCH All Users
exports.findAll = (req, res) => {
	userService.findAll()
		.then(users => {
			// Send All users to Client
			res.json(users.sort(function (c1, c2) { return c1.id - c2.id }));
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Find a User by Id
exports.findByPk = (req, res) => {
	userService.findByPk(req)
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Find a User by Token
exports.findByToken = (req, res) => {
	userService.findByToken(req)
		.then(user => {
			res.json({
				id: user.id,
				role: user.role
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Update a User
exports.update = (req, res) => {
	const id = req.body.id;
	userService.update(req, id)
		.then(() => {
			res.status(200).json({ mgs: "Updated Successfully -> User Id = " + id });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Delete a User by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	console.log("Ceci est l'req" + req);

	console.log("Ceci est l'ID" + id);
	userService.remove(id)
		.then(() => {
			res.status(200).json({ msg: 'Deleted Successfully -> User Id = ' + id });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

