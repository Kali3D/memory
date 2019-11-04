(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/Card.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(index, fruit) {
  _classCallCheck(this, Card);

  //à la création, les cartes sont cachées à la droite de l'écran
  //le verso est visible
  this.element = (0, _jquery["default"])("<div class='card hideCard ".concat(fruit, "' id='card").concat(index, "'/></div>"));
  this.element.append("<img src='./images/cover.jpg' />"); //évite un mouvement désagréable de la carte quand on clique/glisse

  this.element.on("mousemove", function (event) {
    event.preventDefault();
  }); //au click, on repasse la main au manager

  this.element.on("click", function () {
    manager.spin(this);
  });
};

;
var _default = Card;
exports["default"] = _default;
});

require.register("js/Clocks.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Clocks =
/*#__PURE__*/
function () {
  function Clocks() {
    _classCallCheck(this, Clocks);

    this.createThreeScene();
  }

  _createClass(Clocks, [{
    key: "createThreeScene",
    value: function createThreeScene() {
      var _this = this;

      //textures
      this.textures = [new THREE.TextureLoader().load("./images/clock.png"), new THREE.TextureLoader().load("./images/clock2.png"), new THREE.TextureLoader().load("./images/clock3.png")]; //renderer

      this.container = document.getElementById("gl");
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.container,
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      window.onresize = function () {
        return _this.resize();
      }; //scene


      this.scene = new THREE.Scene();
      this.root = new THREE.Object3D();
      this.scene.add(this.root); //camera

      this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
      this.camera.position.set(0, 0, 20);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.root.add(this.camera); //light

      var light = new THREE.DirectionalLight("#ffffff", 1.5);
      light.position.set(0, 1, 1);
      this.root.add(light); //clocks

      this.clocks = new THREE.Object3D();
      var geometry = new THREE.PlaneBufferGeometry(1, 1);

      for (var i = 0; i < 30; i++) {
        var clock = new THREE.Mesh(geometry);
        this.randomizeClock(clock);
        this.clocks.add(clock);
      }

      this.root.add(this.clocks);
    } //permet de resizer le canvas en même temps que la fenêtre

  }, {
    key: "resize",
    value: function resize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: "randomizeClock",
    value: function randomizeClock(clock) {
      var speedRef = 0.03;
      var rotationRef = 0.1; //choisit une texture aléatoire dans le tableau

      var texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      this.setMaterial(clock, texture);
      var scale = Math.random() * 1.5;
      clock.scale.set(scale, scale, scale);
      clock.position.set(Math.random() * 30 - 15, Math.random() * 15 + 5, 0);
      clock.speed = speedRef + Math.random() * speedRef * 2;
      clock.rotZ = rotationRef - Math.random() * rotationRef * 2;
    } //evite la création d'un nouveau matériel à chaque tick

  }, {
    key: "setMaterial",
    value: function setMaterial(clock, texture) {
      if (clock.material.map) clock.material.map = texture;else {
        var mat = new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          map: texture,
          side: THREE.DoubleSide
        });
        clock.material = mat;
      }
    } //methode appelée à chaque tick
    //on y met à jour tous les objects et on affiche la nouvelle scene

  }, {
    key: "update",
    value: function update() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.clocks.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;
          child.rotation.z -= child.rotZ;
          child.position.y -= child.speed;
          if (child.position.y < -15) this.randomizeClock(child);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return Clocks;
}();

;
var _default = Clocks;
exports["default"] = _default;
});

require.register("js/Counter.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

var _moment = _interopRequireDefault(require("moment"));

var _three = require("three");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Counter =
/*#__PURE__*/
function () {
  function Counter() {
    _classCallCheck(this, Counter);

    this.duration = 0;
    this.remain = 0;
    this.started = false;
    this.ended = false;
    this.lasted = 0;
  }

  _createClass(Counter, [{
    key: "start",
    value: function start(duration) {
      this.started = true; //compteur de temps donnant accès au temps écoulé depuis le lancement

      this.clock = new _three.Clock(); //on ajoute 1 seconde pour qu'à l'affichage on commence bien à la durée sélectionnée (05:00 et non 04:59)

      this.duration = parseInt(duration, 10) + 1;
      this.remain = _moment["default"].utc(this.duration * 1000);
      this.display();
    }
  }, {
    key: "display",
    value: function display() {
      //affichage du compteur
      (0, _jquery["default"])(".time").html("Il vous reste ".concat(this.remain.format('mm:ss'), " minute(s)")); //calcul du temps ecoulé en poucentage pour la barre de progression

      var percent = Math.floor(this.clock.getElapsedTime() / (this.duration - 1) * 100);
      (0, _jquery["default"])("#elapsed").attr("value", percent).html(percent + " %"); //stockage de la duree de la partie

      this.lasted = Math.floor(this.clock.getElapsedTime() * 1000); //check si le temps imparti est écoulé

      if (percent >= 100) this.ended = true;
    }
  }, {
    key: "update",
    //appelé à chaque tick si le jeu est démarré et non terminé
    //et si le compteur est démarré (started = true) et non termine(ended = false)
    value: function update() {
      //mise à jour du temps restant ...
      this.remain = _moment["default"].utc(this.duration * 1000 - this.clock.getElapsedTime() * 1000); // ... et de l'affichage

      this.display();
    }
  }]);

  return Counter;
}();

;
var _default = Counter;
exports["default"] = _default;
});

require.register("js/Manager.js", function(exports, require, module) {
"use strict";

require("moment/locale/fr");

require("babel-polyfill");

var _jquery = _interopRequireDefault(require("jquery"));

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

var _Card = _interopRequireDefault(require("./Card"));

var _Spinner = _interopRequireDefault(require("./Spinner"));

var _Counter = _interopRequireDefault(require("./Counter"));

var _Scores = _interopRequireDefault(require("./Scores"));

var _Clocks = _interopRequireDefault(require("./Clocks"));

var tools = _interopRequireWildcard(require("./tools"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Manager =
/*#__PURE__*/
function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.init();
    this.clocks = new _Clocks["default"]();
    this.update();
  }

  _createClass(Manager, [{
    key: "init",
    value: function init() {
      this.spinner = new _Spinner["default"]();
      this.counter = new _Counter["default"]();
      this.scores = new _Scores["default"]();
      this.fruitClicked = null;
      this.nbClicks = 0;
      this.nbPairs = 0;
      this.gameStarted = false;
      this.gameEnded = false;
      this.gameLasted = 0;
      this.tools = tools;
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this = this;

      this.tools.hideDecal(".card.showCard", 50);
      setTimeout(function () {
        (0, _jquery["default"])(".board").html("");
        (0, _jquery["default"])(".again").css({
          display: "none"
        });
        (0, _jquery["default"])(".beforeCount.v2").removeClass("current");
        (0, _jquery["default"])(".beforeCount.v1").addClass("current").css({
          display: "flex"
        });
        (0, _jquery["default"])(".beforeCount.v1 select").val("1");
        (0, _jquery["default"])(".beforeCount.v2 input").val("");
        (0, _jquery["default"])(".backdrop").removeClass("show");

        _this.init();

        _this.setCards();
      }, 2000);
    }
  }, {
    key: "setCards",
    value: function setCards() {
      var _this2 = this;

      //on crée 28 cartes => 14 paires
      //creation de la liste de 14 fruits choisis aléatoirement parmi les 18 proposés
      var fruits = ['pommeRouge', 'banane', 'orange', 'citronVert', 'grenade', 'abricot', 'citronJaune', 'fraise', 'pommeVerte', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise', 'mangue', 'bigarot'];
      this.tools.softRandom(fruits).slice(0, 14); //positions aléatoires dans le plateau pour les mélanger

      var ranks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]; //		for (let i=0; i<5; i++)

      ranks = this.tools.randomizeArray(ranks); //on stocke nos 28 cartes mélangées dans un tableau d'éléments

      var elements = [];
      var fruitIndex = 0;

      for (var i = 0; i < 28; i++) {
        elements[ranks[i]] = new _Card["default"](i, fruits[fruitIndex]).element; //toutes les 2 cartes, on change de fruit

        if (i % 2 === 1) fruitIndex++;
      } //on ajoute les cartes aux plateau ...


      (0, _jquery["default"])(".board").append(elements); // ... et on les anime pour l'affichage

      setTimeout(function () {
        _this2.tools.showDecal(".card", 50);
      }, 300);
    }
  }, {
    key: "showScores",
    //recupère les 5 meilleurs scores en base
    //et les affiche dans le backdrop
    value: function () {
      var _showScores = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var html;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.scores.get();

              case 3:
                html = _context.sent;
                this.tools.showBackdrop(5000, function () {
                  (0, _jquery["default"])(".backdrop").html(html);
                });
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.dir(_context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function showScores() {
        return _showScores.apply(this, arguments);
      }

      return showScores;
    }() //champ de saisie du temps : permet de valider son choix avec 'Enter'
    //au lieu de cliquer sur valider

  }, {
    key: "checkKey",
    value: function checkKey(event) {
      if (event.key === "Enter") this.startGame();
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var _this3 = this;

      this.gameStarted = true; //le jeu commence
      //on retire le backdrop s'il est toujours visible

      (0, _jquery["default"])(".backdrop").removeClass("show"); //on vérifie d'abord si la valeur de temps est valide
      //le cas échéant on affiche une erreur

      (0, _jquery["default"])(".error").html("");
      var val = parseInt((0, _jquery["default"])(".current #duration").val(), 10);

      if (!val || val < 0) {
        //val vaut Nan ou 0
        (0, _jquery["default"])(".error").html("Oups ... J'ai pas compris !");
        (0, _jquery["default"])(".current #duration").val("");
      } else if (val > 59) {
        // bon y a 28 cartes, personne n'a besoin de plus d'une heure !!
        (0, _jquery["default"])(".error").html("Faut pas exag&eacute;rer ... 59 minutes max !");
        (0, _jquery["default"])(".current #duration").val("");
      } else {
        //on laisse 300ms à l'animation du bouton 
        setTimeout(function () {
          //et on démarre le compteur de temps
          var duration = val * 60;
          (0, _jquery["default"])(".beforeCount").css({
            display: "none"
          });
          (0, _jquery["default"])(".counting").css({
            display: "flex"
          });

          _this3.counter.start(duration);
        }, 300);
      }
    }
  }, {
    key: "spin",
    value: function spin(target) {
      var _this4 = this;

      //on ne retourne une carte que si :
      // - le jeu est démarré
      // - moins de 2 cartes sont retournées
      // - la carte cliquée n'est pas déjà retournée
      if (this.gameStarted && this.nbClicks < 2 && !(0, _jquery["default"])(target).hasClass("discover")) {
        if (!this.fruitClicked) {
          //on retourne la première carte
          this.spinner.spin(target);
          this.fruitClicked = target;
          this.nbClicks++;
        } else {
          // on retourne la seconde ...
          this.spinner.spin(target, this.fruitClicked);
          this.fruitClicked = null;
          this.nbClicks++; // ... et on verifie si c'est une paire

          if (this.spinner.pair) {
            this.nbClicks = 0;
            this.nbPairs++;
          } else {
            setTimeout(function () {
              // IMPORTANT ! sans ce test ce timeout peut se déclencher APRES la fin du jeu
              // et permettre au joueur de retourner des cartes même s'il a perdu
              if (!_this4.gameEnded) _this4.nbClicks = 0;
            }, 2000);
          } //si toutes les cartes sont retournées, on clôture le jeu


          if (this.nbPairs === 14) {
            //on conserve la duree de la partie pour stockage
            this.gameLasted = this.counter.lasted;
            this.endGame(true);
          }
        }
      }
    }
  }, {
    key: "endGame",
    value: function endGame(won) {
      var _this5 = this;

      this.nbClicks = 3;
      this.gameEnded = true; //on laisse 500ms à la dernière carte pour se retourner en entier

      setTimeout(function () {
        (0, _jquery["default"])(".counting").css({
          display: "none"
        });
        (0, _jquery["default"])(".again").css({
          display: "flex"
        }); //on applique les classes css 'cartes retournée' pour éviter un flip à 180°

        (0, _jquery["default"])(".discover").addClass("showDiscovered");
        (0, _jquery["default"])(".card").removeClass("recover").removeClass("discover");

        if (won) {
          //si la partie est gagné, on stocke le résultat en base
          _this5.scores.add({
            date: (0, _moment["default"])(Date.now()).format("dddd D MMMM YYYY, HH[h]mm"),
            duration: _this5.gameLasted
          });

          _this5.tools.showBackdrop(5000, function () {
            (0, _jquery["default"])(".backdrop").html("Bravo, c'est gagn&eacute; !!!<br />Vous avez trouv&eacute; en ".concat(_moment["default"].utc(_this5.gameLasted).format('mm:ss'), " minute(s)"));
          });
        } else {
          _this5.tools.showBackdrop(5000, function () {
            (0, _jquery["default"])(".backdrop").html("Arf ..., c'est perdu !");
          });
        }
      }, 500);
    }
  }, {
    key: "update",
    // exécuté à chaque tick
    value: function update() {
      var _this6 = this;

      //mise à jour du compteur de temps
      //on n'exécute cette partie que si le jeu est en cours et qu'il reste du temps
      if (this.gameStarted && !this.gameEnded) {
        if (this.counter && this.counter.started) {
          if (this.counter.ended) {
            this.endGame(false);
            this.gameLasted = this.counter.lasted;
            this.counter = null;
          } else this.counter.update();
        }
      } //mise à jour des positions, rotations, ... des 'clocks'


      this.clocks.update(); //et on recommence au tick suivant

      requestAnimationFrame(function () {
        return _this6.update();
      });
    }
  }]);

  return Manager;
}();

module.exports = Manager;
});

require.register("js/Scores.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scores =
/*#__PURE__*/
function () {
  function Scores() {
    _classCallCheck(this, Scores);
  }

  _createClass(Scores, [{
    key: "get",
    //le manager utilise le mécanisme 'async/await' pour récupérer les meilleurs scores
    //on lui retourne une promesse afin qu'il "attende" les résultats avant de les afficher
    value: function get() {
      var _this = this;

      //on demande à la base les 5 meilleurs enregistrements (avec le champ 'duration' le plus petit)
      return _axios["default"].get("http://localhost:3000/scores").then(function (result) {
        var resp = result.data;
        var results = [];

        for (var _i = 0, _Object$keys = Object.keys(resp); _i < _Object$keys.length; _i++) {
          var score = _Object$keys[_i];
          results.push(resp[score]);
        } //PERTURBANT : le serveur firebase sélectionne correctement les enregistrements
        //mais lorsqu'il les retourne, iles ne sont pas triés !! 
        //(https://firebase.google.com/docs/database/rest/retrieve-data#section-rest-ordered-data)
        //on le retrie donc ici, d'où l'importance de ne récupérer qu'un nombre limité d'enregistrements


        results = results.sort(function (el1, el2) {
          return el1.duration - el2.duration;
        });
        return _this.html(results);
      });
    }
  }, {
    key: "html",
    value: function html(results) {
      var html = "<div class='scoreDiv'>\n\t\t<div class=\"principe\">Retrouvez toutes les paires dans le temps imparti et c'est gagn\xE9 !</div>\n\t\t<div class='best'>5 meilleurs scores :</div>";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var result = _step.value;
          //la duree est stockée en nb de secondes pour permettre le tri
          //on la reformatte ici pour l'affichage
          html = html.concat("<div class='score'>\n\t\t\t\t<div class='date'>".concat(result.date, "</div>\n\t\t\t\t<div class='duration'>").concat(_moment["default"].utc(result.duration).format('mm:ss'), "</div></div>"));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      html = html.concat("</div>");
      return html;
    } //ajout d'un enregistrement quand la partie est gagnée

  }, {
    key: "add",
    value: function add(obj) {
      _axios["default"].post("http://localhost:3000/score", obj).then(function (resp) {
        console.log(resp.data);
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }]);

  return Scores;
}();

;
var _default = Scores;
exports["default"] = _default;
});

require.register("js/Spinner.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Spinner =
/*#__PURE__*/
function () {
  function Spinner() {
    _classCallCheck(this, Spinner);
  }

  _createClass(Spinner, [{
    key: "spin",
    value: function spin(target, stored) {
      this.toggle([target], "recover", "discover", "none"); //si une 1ère carte est stockée, on évalue la paire

      if (stored) this.eval(target, stored);
    }
  }, {
    key: "eval",
    value: function _eval(target, stored) {
      var _this = this;

      //cas par défaut, soyons positifs !
      this.pair = true; //on compare les classes css
      //2 cartes identiques auront la même classes fruit

      if (target.className !== stored.className) {
        this.pair = false; //on laisse les cartes découvertes 1.5s pour qu'on puisse les mémoriser
        //et on les retourne

        setTimeout(function () {
          _this.toggle([target, stored], "discover", "recover", "block");
        }, 1500);
      }
    } //l'image du fruit est dans la propriété background
    //on utilise une image dans la div 'card' pour simuler la carte retournée
    //l'argument display sert à gérer l'apparition/disparition de ce "verso" de la carte
    //on utilise un tableau de cibles afin de pouvoir animer 2 cartes en même temps

  }, {
    key: "toggle",
    value: function toggle(targets, from, to, display) {
      (0, _jquery["default"])(targets[0]).removeClass(from).addClass(to);
      if (targets[1]) (0, _jquery["default"])(targets[1]).removeClass(from).addClass(to); //l'animation est linéaire (régulière)
      //à la moitié de l'animation (250ms) la carte n'est qu'un trait à l'écran
      //on profite de cette instant pour aficher/cacher le verso

      setTimeout(function () {
        (0, _jquery["default"])("#" + targets[0].id + " > img").css({
          display: display
        });
        if (targets[1]) (0, _jquery["default"])("#" + targets[1].id + " > img").css({
          display: display
        });
      }, 250);
    }
  }]);

  return Spinner;
}();

var _default = Spinner;
exports["default"] = _default;
});

require.register("js/tools.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showBackdrop = exports.hideDecal = exports.showDecal = exports.release = exports.press = exports.checkDuration = exports.randomizeArray = exports.softRandom = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var softRandom = function softRandom(array) {
  return array.sort(function () {
    return 0.5 - Math.random();
  });
};

exports.softRandom = softRandom;

var randomizeArray = function randomizeArray(array) {
  var res = [];
  var nbItems = 0;

  while (nbItems < array.length) {
    var index = Math.round(Math.random() * (array.length - 1)); //si l'élément d'index 'index' n'est pas déjà rempli

    if (res[index] === undefined) {
      // pour le dernier élément à placer, on ne fait pas d'autres tests pour éviter une boucle infinie
      if (nbItems === array.length - 1) {
        res[index] = array[nbItems];
        nbItems++; //on veut éviter au maximum que 2 éléments d'une paire se suivent
        //les paires sont de la forme (chiffre pair, chiffre pair +1)
        //on vérifie que les éléments précédent et suivant ne sont pas l'autre carte de la paire
      } else if (array[nbItems] % 2 !== 0) {
        if (res[index - 1] === undefined || res[index - 1] !== array[nbItems] - 1) {
          if (res[index + 1] === undefined || res[index + 1] !== array[nbItems] - 1) {
            res[index] = array[nbItems];
            nbItems++;
          }
        }
      } else {
        if (res[index - 1] === undefined || res[index - 1] !== array[nbItems] + 1) {
          if (res[index + 1] === undefined || res[index + 1] !== array[nbItems] + 1) {
            res[index] = array[nbItems];
            nbItems++;
          }
        }
      }
    }
  }

  return res;
}; //gère le changement d'état du <select> de durée
//si le choix est 'choose', on affiche le champ de saisie


exports.randomizeArray = randomizeArray;

var checkDuration = function checkDuration() {
  var val = (0, _jquery["default"])(".current #duration").val();

  if (val === "choose") {
    (0, _jquery["default"])(".beforeCount.v1").removeClass("current").css({
      display: "none"
    });
    (0, _jquery["default"])(".beforeCount.v2").addClass("current").css({
      display: "flex"
    });
    (0, _jquery["default"])(".beforeCount.v2 input").focus();
  }
}; //animations boutons


exports.checkDuration = checkDuration;

var press = function press(event) {
  (0, _jquery["default"])(event.target).removeClass("released").addClass("pressed");
};

exports.press = press;

var release = function release(event) {
  (0, _jquery["default"])(event.target).removeClass("pressed").addClass("released");
}; //permet d'animer une collection d'éléments avec un décalage dans l'exécution
//on utilise pour ce faire des classes css de la forme hideXXX et showXXX
//le mécanisme show affiche les éléments de 0 à x
//hide var traiter les éléments de x à 0 
//(dans notre cas, évite que les cartes se chevauchent en disparaissant)


exports.release = release;

var showDecal = function showDecal(selector) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  (0, _jquery["default"])(selector).each(function (id, element) {
    (0, _jquery["default"])(element).attr("class", (0, _jquery["default"])(element).attr("class").replace(new RegExp("hide", 'g'), "show")).css({
      "transition-delay": id * delay + "ms"
    });
  });
};

exports.showDecal = showDecal;

var hideDecal = function hideDecal(selector) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var from = (0, _jquery["default"])(selector).length * delay;
  (0, _jquery["default"])(selector).each(function (id, element) {
    (0, _jquery["default"])(element).attr("class", (0, _jquery["default"])(element).attr("class").replace(new RegExp("show", 'g'), "hide")).css({
      "transition-delay": from - id * delay + "ms"
    });
  });
}; //affiche le backdrop
//on utilise la fonction func pour gérer le contenu


exports.hideDecal = hideDecal;

var showBackdrop = function showBackdrop(duration, func) {
  (0, _jquery["default"])(".backdrop").addClass("show");
  if (typeof func === "function") func.apply(_this);
  setTimeout(function () {
    (0, _jquery["default"])(".backdrop").removeClass("show");
  }, duration);
};

exports.showBackdrop = showBackdrop;
});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=index.js.map