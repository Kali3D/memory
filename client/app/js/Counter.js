import $ from "jquery";
import moment from "moment";
import {Clock} from "three";

class Counter {
	constructor() {
		this.duration = 0;
		this.remain = 0;
		this.started = false;
		this.ended = false;
		this.lasted = 0;
	};

	start(duration) {
		this.started = true;
		//compteur de temps donnant accès au temps écoulé depuis le lancement
		this.clock = new Clock();
		//on ajoute 1 seconde pour qu'à l'affichage on commence bien à la durée sélectionnée (05:00 et non 04:59)
		this.duration = parseInt(duration, 10) + 1;
		this.remain = moment.utc(this.duration*1000);
		this.display();
	};

	display() {
		//affichage du compteur
		$(".time").html(`Il vous reste ${this.remain.format('mm:ss')} minute(s)`);

		//calcul du temps ecoulé en poucentage pour la barre de progression
		const percent = Math.floor(this.clock.getElapsedTime()/(this.duration-1) * 100);
		$("#elapsed").attr("value", percent).html(percent+" %");

		//stockage de la duree de la partie
		this.lasted = Math.floor(this.clock.getElapsedTime()*1000);

		//check si le temps imparti est écoulé
		if (percent >= 100)
			this.ended = true;
	};

	//appelé à chaque tick si le jeu est démarré et non terminé
	//et si le compteur est démarré (started = true) et non termine(ended = false)
	update() {
		//mise à jour du temps restant ...
		this.remain = moment.utc(this.duration*1000 - this.clock.getElapsedTime()*1000);
		// ... et de l'affichage
		this.display();
	};
};

export default Counter;