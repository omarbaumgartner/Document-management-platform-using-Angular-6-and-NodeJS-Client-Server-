const sugscomsService = require('../services/sug&coms.service');

exports.getSugs = (req, res) => {
    sugscomsService.getSugs(req, res)
        .then(sug => {
            res.json(sug)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};

exports.newSug = (req, res) => {
    sugscomsService.newSug(req.body, res)
        .then(sug => {
            res.json(sug)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};

exports.updateSug = (req, res) => {
    sugscomsService.updateSug(req, res)
        .then(sug => {
            res.json(sug)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};

exports.deleteSug = (req, res) => {
    sugscomsService.deleteSug(req, res)
        .then(sug => {
            res.json(sug)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};