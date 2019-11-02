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
		this.clock = new Clock();
		this.duration = parseInt(duration, 10) + 1;
		this.remain = moment.utc(this.duration*1000);
		this.display();
	};

	display() {
		$(".time").html(`Il vous reste ${this.remain.format('mm:ss')} minute(s)`);
		const percent = Math.floor(this.clock.getElapsedTime()/(this.duration-1) * 100);
		$("#elapsed").attr("value", percent).html(percent+" %");
		this.lasted = moment.utc(this.clock.getElapsedTime()*1000).format('mm:ss');
		if (percent >= 100)
			this.ended = true;
	};

	update() {
		this.remain = moment.utc(this.duration*1000 - this.clock.getElapsedTime()*1000);
		this.display();
	};
};

export default Counter;