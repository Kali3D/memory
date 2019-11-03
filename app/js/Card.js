import $ from "jquery";

class Card {
	constructor(index, fruit) {
		//à la création, les cartes sont cachées à la droite de l'écran
		//le verso est visible
		this.element = $(`<div class='card hideCard ${fruit}' id='card${index}'/></div>`);
		this.element.append("<img src='./images/cover.jpg?test' />");

		//évite un mouvement désagréable de la carte quand on clique/glisse
		this.element.on("mousemove", function(event) {event.preventDefault()});

		//au click, on repasse la main au manager
		this.element.on("click", function() {manager.spin(this)});
	}
};

export default Card;