import $ from "jquery";
import axios from "axios";
import moment from "moment";
import "moment/locale/fr";
import "babel-polyfill"

import Card from "./Card";
import Spinner from "./Spinner";
import Counter from "./Counter";
import Scores from "./Scores";
import Clocks from "./Clocks";

import * as tools from "./utils";

class Manager {

	constructor() {
		this.clocks = new Clocks();
		this.init();
		this.update();

	}

	init() {
		this.spinner = new Spinner();
		this.counter = new Counter();
		this.scores = new Scores();
		this.fruitClicked = null;
		this.nbClicks = 0;
		this.nbPairs = 0;
		this.gameStarted = false;
		this.gameEnded = false;
		this.gameLasted = 0;
		this.tools = tools;
	}

	reset() {
		this.tools.hideDecal(".card.showCard", 50);
		setTimeout(() => {
			$(".board").html("");
			$(".again").css({display: "none"});
			$(".beforeCount.v2").removeClass("current");
			$(".beforeCount.v1").addClass("current").css({display: "flex"});
			$(".beforeCount.v1 select").val("1");
			$(".beforeCount.v2 input").val("");
			$(".backdrop").removeClass("show");
			this.init();
			this.setCards();
		}, 2000)
	}

	setCards() {
		//creation de la liste de fruits réduite à 14
		const fruits = ['pomme', 'banane', 'orange', 'citronVert', 'grenade', 'abricot', 'citronJaune', 'fraise', 'pomme', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise', 'mangue', 'bigarot'];
		this.tools.randomizeArray(fruits).slice(14);
		
		//positions aléatoires
		const ranks = this.tools.randomizeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);

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
		setTimeout(() => {
			this.tools.showDecal(".card", 50);
		}, 300);
	};

	async showScores() {
		try {
			const html = await this.scores.init();
			this.tools.showBackdrop(5000, () => {
				$(".backdrop").html(html);
			});
		} catch(error) {
			console.dir(error);
		}
	}
	

	checkKey(event) {
		if (event.key === "Enter")
			this.startGame();
	};

	startGame() {
		this.gameStarted = true;
		$(".backdrop").removeClass("show");
		$(".error").html("");
		const val = parseInt($(".current #duration").val(), 10);
		if (!val)  {
			$(".error").html("Oups ... J'ai pas compris !");
			$(".current #duration").val("");
		} else if (val > 59) {
			$(".error").html("Faut pas exag&eacute;rer ... 59 minutes max !");
			$(".current #duration").val("");
		} else {
			setTimeout(() => {
				const duration = val * 60;
				$(".beforeCount").css({display: "none"});
				$(".counting").css({display: "flex"});
				this.counter.start(duration);
			}, 300);
		}
	};

	spin(target) {
		//on ne retourne une carte que si moins de 2 cartes sont retournées
		//et si cette carte n'est pas déjà retournée
		if (this.gameStarted && this.nbClicks < 2 && !$(target).hasClass("discover")) {
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
						if (!this.gameEnded)
							this.nbClicks = 0;
					}, 2000);
				}
				//si toutes les cartes sont retournées, on clôture le jeu
				if (this.nbPairs === 14) {
					this.gameLasted = this.counter.lasted;
					console.dir(this.counter);
					console.log(this.gameLasted);
					this.endGame(true);
				}
			}
		}
	};

	endGame(won) {
		this.nbClicks = 3;
		this.gameEnded = true;
		setTimeout(() => {
			$(".counting").css({display: "none"});
			$(".again").css({display: "flex"});
			$(".discover").addClass("showDiscovered");
			$(".card").removeClass("recover").removeClass("discover");
			if (won) {
				this.scores.add({date: moment(Date.now()).format("dddd D MMMM YYYY, HH[h]mm"), duration: this.gameLasted});
				this.tools.showBackdrop(5000, () => {
					$(".backdrop").html(`Bravo, c'est gagn&eacute; !!!<br />Vous avez trouv&eacute; en ${moment.utc(this.gameLasted).format('mm:ss')} minute(s)`);
				});
			} else {
				this.tools.showBackdrop(5000, () => {
					$(".backdrop").html("Arf ..., c'est perdu !");
				});
			}
		}, 500);
	};

	update() {
		if (this.gameStarted && !this.gameEnded) {
			if (this.counter && this.counter.started) {
				if (this.counter.ended) {
					this.endGame(false);
					this.gameLasted = this.counter.lasted;
					this.counter = null;
				} else
					this.counter.update();
			}
		}
		this.clocks.update();
		requestAnimationFrame(() => this.update());
	};
}

module.exports = Manager;