// var express = require('express');
// var mysql = require('mysql');
// var router = express.Router();


// //para poder acceder la bd y los datos usuario de workbench
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'angellogin'
// })
// //para interactuar con la base de datos
// router.post("/", function(request, response){
//     const data = request.body;
//     console.log(data);
    
//     connection.query(`SELECT username FROM users WHERE username = "${data.username}" AND password = MD5("${data.password}")`, (error, rows) => {
//         if ( error)throw error;
//         if(rows.length == 1)
//             response.send(true);
//         else{
//             response.send(false);
//         }
//     });
    
// });


// module.exports = router;