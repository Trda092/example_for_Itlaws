const mysql = require('mysql2')
const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"Ohmye123+++",
    database:"prattler"
})

db.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = db
