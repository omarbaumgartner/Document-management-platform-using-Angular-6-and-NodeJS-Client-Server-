module.exports = (sequelize, Sequelize) => {
	const Doc = sequelize.define('doc', {
	  title: {
			type: Sequelize.STRING
	  },
	  description: {
			type: Sequelize.STRING
	  },
	  author: {
		  type: Sequelize.STRING
	  }
	});
	
	return Doc;
}