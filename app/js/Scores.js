import axios from "axios";
import moment from "moment";

class Scores {

	//le manager utilise le mécanisme 'async/await' pour récupérer les meilleurs scores
	//on lui retourne une promesse afin qu'il "attende" les résultats avant de les afficher
	get() {
		//on demande à la base les 5 meilleurs enregistrements (avec le champ 'duration' le plus petit)
		return axios.get("http://localhost:3000/scores").then(result => {
			const resp = result.data;
			let results = [];
			for (let score of Object.keys(resp))
				results.push(resp[score]);

			//PERTURBANT : le serveur firebase sélectionne correctement les enregistrements
			//mais lorsqu'il les retourne, iles ne sont pas triés !! 
			//(https://firebase.google.com/docs/database/rest/retrieve-data#section-rest-ordered-data)
			//on le retrie donc ici, d'où l'importance de ne récupérer qu'un nombre limité d'enregistrements
			results = results.sort((el1, el2) => el1.duration - el2.duration);

			return this.html(results);
		});
	};

	html(results) {
		let html = `<div class='scoreDiv'>
		<div class="principe">Retrouvez toutes les paires dans le temps imparti et c'est gagné !</div>
		<div class='best'>5 meilleurs scores :</div>`;
		for (let result of results) 
			//la duree est stockée en nb de secondes pour permettre le tri
			//on la reformatte ici pour l'affichage
			html = html.concat(`<div class='score'>
				<div class='date'>${result.date}</div>
				<div class='duration'>${moment.utc(result.duration).format('mm:ss')}</div></div>`);
		html = html.concat("</div>");
		return html;
	}

	//ajout d'un enregistrement quand la partie est gagnée
	add(obj) {
		axios.post("http://localhost:3000/score", obj)
		.then(resp => {
			console.log(resp.data)
		}).catch(error => {
			console.log(error);
		});
	};
};

export default Scores;