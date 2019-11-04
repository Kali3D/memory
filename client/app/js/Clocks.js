import * as THREE from "three";


class Clocks {
	constructor() {
		this.createThreeScene();
	}

	createThreeScene() {
		//textures
		this.textures = [
			new THREE.TextureLoader().load("./images/clock.png"),
			new THREE.TextureLoader().load("./images/clock2.png"),
			new THREE.TextureLoader().load("./images/clock3.png")
		];

		//renderer
		this.container = document.getElementById("gl");
		this.renderer = new THREE.WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		window.onresize = () => this.resize();

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
	}

	//permet de resizer le canvas en même temps que la fenêtre
	resize() {
		this.camera.aspect = window.innerWidth/window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	randomizeClock(clock) {
		const speedRef = 0.03;
		const rotationRef = 0.1;
		//choisit une texture aléatoire dans le tableau
		const texture = this.textures[Math.floor(Math.random()*this.textures.length)];
		this.setMaterial(clock, texture);
		const scale = Math.random()*1.5;
		clock.scale.set(scale, scale, scale);
		clock.position.set(Math.random()*30 - 15, Math.random()*15 + 5, 0);
		clock.speed = speedRef + Math.random() * speedRef*2;
		clock.rotZ = rotationRef - Math.random() * rotationRef*2;
	}

	//evite la création d'un nouveau matériel à chaque tick
	setMaterial(clock, texture) {
		if (clock.material.map)
			clock.material.map = texture;
		else {
			const mat = new THREE.MeshBasicMaterial({transparent: true, depthWrite: false, map: texture, side: THREE.DoubleSide})
			clock.material = mat;
		}
	}

	//methode appelée à chaque tick
	//on y met à jour tous les objects et on affiche la nouvelle scene
	update() {
		for (var child of this.clocks.children) {
			child.rotation.z -= child.rotZ;
			child.position.y -= child.speed;
			if (child.position.y < -15)
				this.randomizeClock(child);
		}
		this.renderer.render(this.scene, this.camera);
	}
};

export default Clocks;