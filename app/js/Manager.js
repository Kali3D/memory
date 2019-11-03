import "moment/locale/fr";
import "babel-polyfill"

import $ from "jquery";
import axios from "axios";
import moment from "moment";

import Card from "./Card";
import Spinner from "./Spinner";
import Counter from "./Counter";
import Scores from "./Scores";
import Clocks from "./Clocks";

import * as tools from "./tools";

class Manager {

	constructor() {
		this.init();
		this.clocks = new Clocks();
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
		//on crée 28 cartes => 14 paires

		//creation de la liste de 14 fruits choisis aléatoirement parmi les 18 proposés
		let fruits = ['pommeRouge', 'banane', 'orange', 'citronVert', 'grenade', 'abricot', 'citronJaune', 'fraise', 'pommeVerte', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise', 'mangue', 'bigarot'];
		fruits = this.tools.randomizeArray(fruits).slice(0, 14);
		//positions aléatoires dans le plateau pour les mélanger
		let ranks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
//		for (let i=0; i<5; i++)
			ranks = this.tools.randomizeArray(ranks);
		
		//on stocke nos 28 cartes mélangées dans un tableau d'éléments
		const elements = [];
		let fruitIndex = 0;
		for (let i=0; i<28; i++) {
			elements[ranks[i]] =  new Card(i, fruits[fruitIndex]).element;
			//toutes les 2 cartes, on change de fruit
			if (i%2 === 1)
				fruitIndex++;
		}

		//on ajoute les cartes aux plateau ...
		$(".board").append(elements);
		// ... et on les anime pour l'affichage
		setTimeout(() => {
			this.tools.showDecal(".card", 50);
		}, 300);
	};

	//recupère les 5 meilleurs scores en base
	//et les affiche dans le backdrop
	async showScores() {
		try {
			const html = await this.scores.get();
			this.tools.showBackdrop(5000, () => {
				$(".backdrop").html(html);
			});
		} catch(error) {
			console.dir(error);
		}
	}
	
	//champ de saisie du temps : permet de valider son choix avec 'Enter'
	//au lieu de cliquer sur valider
	checkKey(event) {
		if (event.key === "Enter")
			this.startGame();
	};

	startGame() {
		this.gameStarted = true;
		//le jeu commence
		//on retire le backdrop s'il est toujours visible
		$(".backdrop").removeClass("show");

		//on vérifie d'abord si la valeur de temps est valide
		//le cas échéant on affiche une erreur
		$(".error").html("");
		const val = parseInt($(".current #duration").val(), 10);
		if (!val || val < 0)  { //val vaut Nan ou 0
			$(".error").html("Oups ... J'ai pas compris !");
			$(".current #duration").val("");
		} else if (val > 59) { // bon y a 28 cartes, personne n'a besoin de plus d'une heure !!
			$(".error").html("Faut pas exag&eacute;rer ... 59 minutes max !");
			$(".current #duration").val("");
		} else {
			//on laisse 300ms à l'animation du bouton 
			setTimeout(() => {
				//et on démarre le compteur de temps
				const duration = val * 60;
				$(".beforeCount").css({display: "none"});
				$(".counting").css({display: "flex"});
				this.counter.start(duration);
			}, 300);
		}
	};

	spin(target) {
		//on ne retourne une carte que si :
		// - le jeu est démarré
		// - moins de 2 cartes sont retournées
		// - la carte cliquée n'est pas déjà retournée
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
						// IMPORTANT ! sans ce test ce timeout peut se déclencher APRES la fin du jeu
						// et permettre au joueur de retourner des cartes même s'il a perdu
						if (!this.gameEnded)
							this.nbClicks = 0;
					}, 2000);
				}
				//si toutes les cartes sont retournées, on clôture le jeu
				if (this.nbPairs === 14) {
					//on conserve la duree de la partie pour stockage
					this.gameLasted = this.counter.lasted;
					this.endGame(true);
				}
			}
		}
	};

	endGame(won) {
		this.nbClicks = 3;
		this.gameEnded = true;
		//on laisse 500ms à la dernière carte pour se retourner en entier
		setTimeout(() => {
			$(".counting").css({display: "none"});
			$(".again").css({display: "flex"});

			//on applique les classes css 'cartes retournée' pour éviter un flip à 180°
			$(".discover").addClass("showDiscovered");
			$(".card").removeClass("recover").removeClass("discover");

			if (won) {
				//si la partie est gagné, on stocke le résultat en base
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

	// exécuté à chaque tick
	update() {
		//mise à jour du compteur de temps
		//on n'exécute cette partie que si le jeu est en cours et qu'il reste du temps
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

		//mise à jour des positions, rotations, ... des 'clocks'
		this.clocks.update();

		//et on recommence au tick suivant
		requestAnimationFrame(() => this.update());
	};
}

module.exports = Manager;