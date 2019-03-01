const docsService = require('../services/docs.service');

// Post a Document
exports.createDoc = (req, res) => {
	// Save to PostgreSQL database
	docsService.createDoc(req, res)
		.then(doc => {
			// Send created user to client
			res.json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// FETCH All Docs
exports.findAll = (req, res) => {
	docsService.findAll()
		.then(docs => {
			// Send All users to Client
			res.json(docs.sort(function (c1, c2) { return c1.id - c2.id }));
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Find a Doc by Id
exports.findByPk = (req, res) => {
	Doc.findByPk(req.params.id).then(doc => {
		res.json(doc);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Update a Doc
exports.update = (req, res) => {
	const id = req.body.id;
	docsService.update(req, id)
		.then(() => {
			res.status(200).json({ mgs: "Updated Successfully -> Doc Id = " + id });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Delete a User by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	docsService.remove(id)
		.then(() => {
			res.status(200).json({ msg: 'Deleted Successfully -> User Id = ' + id });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};



// Upload ------------------
exports.uploadFile = (req, res) => {

	docsService.uploadFile(req, res)
		.then(doc => {
			console.log("File Uploaded");
		})
		.catch(err => {
			console.log("error");
			console.log(err);
		});

};


//Optionnel : Storage Part  ------------
// List all files 
exports.getFiles = (req, res) => {
	// Save to PostgreSQL database
	docsService.getFiles()
		.then(doc => {
			// Send created doc to client
			res.json({ files: doc });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Get content from single file
exports.getFileContent = (req, res) => {
	// Save to PostgreSQL database
	docsService.getFileContent(req)
		.then(doc => {
			// Send created doc to client
			res.json("Sent !");
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ msg: "Error :", details: err });
		});
};



/*
// FETCH All Docs
exports.findAll = (req, res) => {
	Doc.findAll().then(docs => {
		// Send All docs to Client
		res.json(docs.sort(function (c1, c2) { return c1.id - c2.id }));
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Find a Doc by Id
exports.findByPk = (req, res) => {
	Doc.findByPk(req.params.id).then(doc => {
		res.json(doc);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Update a Doc
exports.update = (req, res) => {
	const id = req.body.id;
	Doc.update(req.body,
		{ where: { id: id } }).then(() => {
			res.status(200).json({ mgs: "Updated Successfully -> Doc Id = " + id });
		}).catch(err => {
			console.log(err);
			res.status(500).json({ msg: "error", details: err });
		});
};

// Delete a Doc by Id
exports.delete = (req, res) => {
	const id = req.params.id;
	Doc.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).json({ msg: 'Deleted Successfully -> Doc Id = ' + id });
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

// Retrieve all files
exports.list = (req, res) => {
	const fs = require('fs');
	const DIR = './uploads';
	let Doss = new Array();
	fs.readdirSync(DIR).forEach(file => {

		Doss.push(file);
		console.log(file);
	});
	res.status(200).json({ Files: Doss });
	console.log("Files retrieved successfully");
};*/