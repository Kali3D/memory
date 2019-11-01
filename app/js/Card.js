import $ from "jquery";

class Card {
	constructor(index, fruit) {
		this.element = $(`<div class='card ${fruit}' id='card${index}'/></div>`);
		this.element.append("<img src='./images/cover.jpg' />");
		this.setEvents();
	}

	setEvents() {
		this.element.on("mousemove", function(event) {event.preventDefault()});
		this.element.on("click", function() {manager.spin(this)});
	}
};

export default Card;