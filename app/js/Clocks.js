import * as THREE from "three";


class Clocks {
	constructor() {
		//texture
		this.textures = [
			new THREE.TextureLoader().load("./images/clock.png"),
			new THREE.TextureLoader().load("./images/clock2.png"),
			new THREE.TextureLoader().load("./images/clock3.png")
		];
		//renderer
		this.container = document.getElementById("gl");
		console.dir(this.container);
		this.renderer = new THREE.WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		//scene
		this.scene = new THREE.Scene();
		this.root = new THREE.Object3D();
		this.scene.add(this.root);

		//camera
		this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth/this.container.offsetHeight, 0.1, 1000);
		this.camera.position.set(0, 0, 20);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.root.add(this.camera);

		//light
		const light = new THREE.DirectionalLight("#ffffff", 1.5);
		light.position.set(0, 1, 1);
		this.root.add(light);

		//clocks
		this.clocks = new THREE.Object3D();
		const geometry = new THREE.PlaneBufferGeometry(1, 1);
		for (let i=0; i<30; i++) {
			const clock = new THREE.Mesh(geometry);
			this.randomizeClock(clock);
			this.clocks.add(clock);
		}
		this.root.add(this.clocks);

		window.onresize = () => this.resize();
	}

	resize() {
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		this.camera.aspect = this.container.offsetWidth/this.container.offsetHeight;
	}

	randomizeClock(clock) {
		const speedRef = 0.03;
		const rotationRef = 0.1;
		const texture = this.textures[Math.floor(Math.random()*this.textures.length)];
		const mat = new THREE.MeshBasicMaterial({transparent: true, depthWrite: false, map: texture, side: THREE.DoubleSide})
		clock.material = mat;
		const scale = Math.random()*1.5;
		clock.scale.set(scale, scale, scale);
		clock.position.set(Math.random()*30 - 15, Math.random()*15 + 5, 0);
		clock.speed = speedRef + Math.random() * speedRef*2;
		clock.rotZ = rotationRef - Math.random() * rotationRef*2;
//		clock.rotY = rotationRef - Math.random() * rotationRef*2;
	}

	update() {
		for (var child of this.clocks.children) {
			child.rotation.z -= child.rotZ;
//			child.rotation.y -= child.rotY;
			child.position.y -= child.speed;
			if (child.position.y < -15)
				this.randomizeClock(child);
		}
		this.renderer.render(this.scene, this.camera);
	}

};

export default Clocks;