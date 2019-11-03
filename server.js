const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "./public");

const server = express();
let token = "";

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
server.use(bodyParser.json());

server.get("/scores", (request, response) => {
	axios.get('https://memory-c4efa.firebaseio.com/scores.json?orderBy="duration"&limitToFirst=5')
	.then(resp => {
		response.send(resp.data);
	})
	.catch(error => {
		console.dir(error);
	});
});

server.post("/score", (request, response) => {
	console.log(request.body);
	axios.post("https://memory-c4efa.firebaseio.com/scores.json", request.body)
});

server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {server};