const db = require('../config/db.config.js');
const Doc = db.docs;


// Post an Doc
exports.create = (req, res) => {
	// Save to PostgreSQL database
	Doc.create({
		"title": req.body.title,
		"description": req.body.description,
		"author": req.body.author
	}).then(doc => {
		// Send created doc to client
		res.json(doc);
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "error", details: err });
	});
};

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