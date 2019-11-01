import $ from "jquery";

class Spinner {

	spin(target, stored) {
		this.toggle([target], "recover", "discover", "none");
		if (stored)
			this.eval(target, stored);
	};

	eval(target, stored) {
		this.pair = true;	
		if (target.className !== stored.className) {
			this.pair = false;	
			setTimeout(() => {
				this.toggle([target, stored], "discover", "recover", "block");
			}, 1500);
		}
	}

	toggle(targets, from, to, display, stored) {
		$(targets[0]).removeClass(from).addClass(to);
		if (targets[1])
			$(targets[1]).removeClass(from).addClass(to);
		setTimeout(() => {
			$("#"+targets[0].id + " > img").css({display: display});
			if (targets[1]) {
				$("#"+targets[1].id + " > img").css({display: display});
			}

		}, 250);
	}
}

export default Spinner;