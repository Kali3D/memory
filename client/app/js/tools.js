import $ from "jquery";

export const randomizeArray = (array) => {

	const res = [];
	let nbItems = 0;
	while(nbItems < array.length) {
		let index = Math.round(Math.random()*(array.length-1));
		if (res[index] === undefined) {
			if (nbItems === array.length-1) {
				res[index] = array[nbItems];
				nbItems++;
			} else {
			if (res[index-1] === undefined || (res[index-1] !== array[nbItems] + 1 && res[index-1] !== array[nbItems] - 1))
				if (res[index+1] === undefined || (res[index+1] !== array[nbItems] + 1 && res[index+1] !== array[nbItems] - 1)) {
					res[index] = array[nbItems];
					nbItems++;
				}
			}
		}
	}
	return res;
}

//gère le changement d'état du <select> de durée
//si le choix est 'choose', on affiche le champ de saisie
export const checkDuration = () => {
	const val = $(".current #duration").val();
	if (val === "choose") {
		$(".beforeCount.v1").removeClass("current").css({display: "none"});
		$(".beforeCount.v2").addClass("current").css({display: "flex"});
		$(".beforeCount.v2 input").focus();
	}
};

//animations boutons
export const press = (event) => {
	$(event.target).removeClass("released").addClass("pressed");
};

export const release = (event) => {
	$(event.target).removeClass("pressed").addClass("released");
};



//permet d'animer une collection d'éléments avec un décalage dans l'exécution
//on utilise pour ce faire des classes css de la forme hideXXX et showXXX

//le mécanisme show affiche les éléments de 0 à x
//hide var traiter les éléments de x à 0 
//(dans notre cas, évite que les cartes se chevauchent en disparaissant)

export const showDecal = (selector, delay=100) => {
	$(selector).each(function(id, element) {
		$(element).attr("class", $(element).attr("class").replace(new RegExp("hide", 'g'), "show")).css({"transition-delay": (id*delay)+"ms"});
	});
};

export const hideDecal = (selector, delay=100) => {
	var from = $(selector).length * delay;
	$(selector).each(function(id, element) {
		$(element).attr("class", $(element).attr("class").replace(new RegExp("show", 'g'), "hide")).css({"transition-delay": (from - id*delay)+"ms"});
	});
};


//affiche le backdrop
//on utilise la fonction func pour gérer le contenu
export const showBackdrop = (duration, func) => {
	$(".backdrop").addClass("show");
	if (typeof func === "function")
		func.apply(this);
	setTimeout(() => {
		$(".backdrop").removeClass("show");
	}, duration);
};

