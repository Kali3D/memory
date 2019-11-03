import $ from "jquery";

export const randomizeArray = (array) => {
	array.sort(function() {
	  return .5 - Math.random();
	});
	return array;
}

export const checkDuration = () => {
	const val = $(".current #duration").val();
	if (val === "choose") {
		$(".beforeCount.v1").removeClass("current").css({display: "none"});
		$(".beforeCount.v2").addClass("current").css({display: "flex"});
		$(".beforeCount.v2 input").focus();
	}
};

export const press = (event) => {
	$(event.target).removeClass("released").addClass("pressed");
};

export const release = (event) => {
	$(event.target).removeClass("pressed").addClass("released");
};

export const showDecal = (selector, delay) => {
	$(selector).each(function(id, element) {
		$(element).attr("class", $(element).attr("class").replace(new RegExp("hide", 'g'), "show")).css({"transition-delay": (id*(delay ? delay : 100))+"ms"});
	});
};

export const hideDecal = (selector, delay) => {
	var from = $(selector).length * (delay ? delay : 100);
	$(selector).each(function(id, element) {
		$(element).attr("class", $(element).attr("class").replace(new RegExp("show", 'g'), "hide")).css({"transition-delay": (from - id*(delay ? delay : 100))+"ms"});
	});
};

export const showBackdrop = (duration, func) => {
	$(".backdrop").addClass("show");
	if (typeof func === "function")
		func.apply(this);
	setTimeout(() => {
		$(".backdrop").removeClass("show");
	}, duration);
};

