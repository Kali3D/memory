const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../client/public");

//on utilise un mini serveur pour ne pas divulguer l'url de connexion à la base du côté client

const server = express();

server.use(cors({
	origin: '*',
  	optionsSuccessStatus: 200 ,
  	exposedHeaders: "Authorization"
 }));

server.options('*', cors())

server.use(express.static(publicPath));
server.use(bodyParser.json());

//GET /scores
//récupère et retourne les 5 meilleurs scores au format json
server.get("/scores", (request, response) => {
	axios.get('https://memory-c4efa.firebaseio.com/scores.json?orderBy="duration"&limitToFirst=5')
	.then(resp => {
		response.send(resp.data);
	})
	.catch(error => {
		console.dir(error);
	});
});

//POST /score
//enregistre un nouveau score
server.post("/score", (request, response) => {
	axios.post("https://memory-c4efa.firebaseio.com/scores.json", request.body)
	.then(resp => {
		response.send("ok");
	})
});

server.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {server};
