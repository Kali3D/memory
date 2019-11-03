import axios from "axios";
import moment from "moment";

class Scores {

	init() {
		return axios.get("http://localhost:3000/scores").then(result => {
			const resp = result.data;
			let tab = [];
			for (let score of Object.keys(resp))
				tab.push(resp[score]);
			tab = tab.sort((el1, el2) => el1.duration - el2.duration);
			return this.html(tab);
		});
	};

	add(obj) {
		axios.post("http://localhost:3000/score", obj);
	};

	html(results) {
		let html = `<div class='scoreDiv'>
		<div class="principe">Retrouvez toutes les paires dans le temps imparti et c'est gagné !</div>
		<div class='best'>5 meilleurs scores :</div>`;
		for (let result of results) 
			html = html.concat(`<div class='score'>
				<div class='date'>${result.date}</div>
				<div class='duration'>${moment.utc(result.duration).format('mm:ss')}</div></div>`);
		html = html.concat("</div>");
		return html;
	}
};

export default Scores;