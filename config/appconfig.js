require('dotenv').config();

// config.js
module.exports = {
	app: {
		port: process.env.PORT || 5000,
	},
	auth: {
		jwt_secret: process.env.JWT_SECRET_KEY,
	},
    db:{
        uri : process.env.MONGODB_URI,
    }

};