const mysql = require('mysql2')
const db = mysql.createPool({
    user:"u350327849_itlaw",
    host:"31.220.110.101",
    password:"!Itlaw1234",
    database:"u350327849_project_itlaw"
})

// db.connect(function(error){
// 	if(error)
// 	{
// 		throw error;
// 	}
// 	else
// 	{
// 		console.log('MySQL Database is connected Successfully');
// 	}
// });

module.exports = db
