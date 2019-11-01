const path = require("path");
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "./public");

const server = express();

server.use(cors({
	origin: '*',
  	optionsSuccessStatus: 200 ,
  	exposedHeaders: "Authorization"
 }));

server.options('*', cors())

/*server.all('', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization, OPTIONS");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});
*/

server.use(express.static(publicPath));


server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {server};