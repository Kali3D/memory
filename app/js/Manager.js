import $ from "jquery";

import Card from "./Card";
import Spinner from "./Spinner";
import {randomizeArray} from "./utils";

class Manager {

	constructor() {
		this.spinner = new Spinner();
		this.fruitClicked = null;
		this.nbClicks = 0;
		this.nbPairs = 0;
	}

	setCards() {
		//creation de la liste fruits réduite à 14
		const fruits = ['pomme', 'banane', 'orange', 'citronVert', 'grenade', 'abricot', 'citronJaune', 'fraise', 'pomme', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise', 'mangue', 'bigarot'];
		randomizeArray(fruits).slice(14);
		
		//positions aléatoires
		const ranks = randomizeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);

		//creation du tableau de cartes aléatoire
		const elements = [];
		let fruitIndex = 0;
		for (let i=0; i<28; i++) {
			elements[ranks[i]] =  new Card(i, fruits[fruitIndex]).element;
			//toutes les 2 cartes, on change de fruit
			if (i%2 === 1)
				fruitIndex++;
		}

		//ajout du html dans la div plateau
		$(".board").append(elements);
	};

	spin(target) {
		//on ne retourne une carte que si moins de 2 cartes sont retournées
		//et si cette carte n'est pas déjà retournée
		if (this.nbClicks < 2 && !$(target).hasClass("discover")) {
			if (!this.fruitClicked) {
				//on retourne la première carte
				this.spinner.spin(target);
				this.fruitClicked = target;
				this.nbClicks++;
			} else {
				// on retourne la seconde ...
				this.spinner.spin(target, this.fruitClicked);
				this.fruitClicked = null;
				this.nbClicks++;
				// ... et on verifie si c'est une paire
				if (this.spinner.pair) {
					this.nbClicks = 0;
					this.nbPairs++;
				} else {
					setTimeout(() => {
						this.nbClicks = 0;
					}, 2000);
				}
				//si toutes les cartes sont retournées, on clôture le jeu
				if (this.nbPairs === 14)
					this.endGame();

			}
		}
	};

	endGame() {
		this.nClicks = 3;
		console.log("game ended");
	}
}

module.exports = Manager;