import $ from "jquery";

class Spinner {

	spin(target, stored) {
		this.toggle([target], "recover", "discover", "none");

		//si une 1ère carte est stockée, on évalue la paire
		if (stored)
			this.eval(target, stored);
	};

	eval(target, stored) {
		//cas par défaut, soyons positifs !
		this.pair = true;	

		//on compare les classes css
		//2 cartes identiques auront la même classes fruit
		if (target.className !== stored.className) {
			this.pair = false;	
			//on laisse les cartes découvertes 1.5s pour qu'on puisse les mémoriser
			//et on les retourne
			setTimeout(() => {
				this.toggle([target, stored], "discover", "recover", "block");
			}, 1500);
		}
	}

	//l'image du fruit est dans la propriété background
	//on utilise une image dans la div 'card' pour simuler la carte retournée
	//l'argument display sert à gérer l'apparition/disparition de ce "verso" de la carte
	//on utilise un tableau de cibles afin de pouvoir animer 2 cartes en même temps
	toggle(targets, from, to, display) {
		$(targets[0]).removeClass(from).addClass(to);
		if (targets[1])
			$(targets[1]).removeClass(from).addClass(to);
		//l'animation est linéaire (régulière)
		//à la moitié de l'animation (250ms) la carte n'est qu'un trait à l'écran
		//on profite de cette instant pour aficher/cacher le verso
		setTimeout(() => {
			$("#"+targets[0].id + " > img").css({display: display});
			if (targets[1])
				$("#"+targets[1].id + " > img").css({display: display});
		}, 250);
	}
}

export default Spinner;