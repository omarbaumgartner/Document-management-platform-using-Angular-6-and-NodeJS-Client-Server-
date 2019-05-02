const userService = require('../services/user.service');


// Post a User
exports.createUser = (req, res) => {
	// Save to PostgreSQL database
	userService.createUser(req, res)
		.then(user => user ? res.json({ user }) : res.status(200).json({ email: 'Taken' }))
		.catch(err => {
			next(err);
			res.status(500).json({ message: 'Email is already taken' })
		});
};

// FETCH All Users
exports.findAllUsers = (req, res) => {
	userService.findAllUsers()
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
exports.findUserById = (req, res) => {
	userService.findUserById(req)
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Find a User by Id
exports.checkEmail = (req, res) => {
	userService.checkEmail(req)
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
exports.updateUser = (req, res) => {
	const id = req.body.id;
	userService.updateUser(req, id)
		.then(() => {
			res.status(200).json({ mgs: "Updated Successfully -> User Id = " + id });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Delete a User by Id
exports.removeUser = (req, res) => {
	const id = req.params.id;
	userService.removeUser(id)
		.then(() => {
			res.status(200).json({ msg: 'Deleted Successfully -> User Id = ' + id });
		})
		.catch(err => {
			res.status(500).json({ msg: "error", details: err });
		});
};


