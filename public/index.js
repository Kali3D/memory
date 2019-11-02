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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Card =
/*#__PURE__*/
function () {
  function Card(index, fruit) {
    _classCallCheck(this, Card);

    this.element = (0, _jquery["default"])("<div class='card hideCard ".concat(fruit, "' id='card").concat(index, "'/></div>"));
    this.element.append("<img src='./images/cover.jpg' />");
    this.setEvents();
  }

  _createClass(Card, [{
    key: "setEvents",
    value: function setEvents() {
      this.element.on("mousemove", function (event) {
        event.preventDefault();
      });
      this.element.on("click", function () {
        manager.spin(this);
      });
    }
  }]);

  return Card;
}();

;
var _default = Card;
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
      this.started = true;
      this.clock = new _three.Clock();
      this.duration = parseInt(duration, 10) + 1;
      this.remain = _moment["default"].utc(this.duration * 1000);
      this.display();
    }
  }, {
    key: "display",
    value: function display() {
      (0, _jquery["default"])(".time").html("Il vous reste ".concat(this.remain.format('mm:ss'), " minute(s)"));
      var percent = Math.floor(this.clock.getElapsedTime() / (this.duration - 1) * 100);
      (0, _jquery["default"])("#elapsed").attr("value", percent).html(percent + " %");
      this.lasted = _moment["default"].utc(this.clock.getElapsedTime() * 1000).format('mm:ss');
      if (percent >= 100) this.ended = true;
    }
  }, {
    key: "update",
    value: function update() {
      this.remain = _moment["default"].utc(this.duration * 1000 - this.clock.getElapsedTime() * 1000);
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

var _jquery = _interopRequireDefault(require("jquery"));

var _Card = _interopRequireDefault(require("./Card"));

var _Spinner = _interopRequireDefault(require("./Spinner"));

var _Counter = _interopRequireDefault(require("./Counter"));

var tools = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Manager =
/*#__PURE__*/
function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.init();
  }

  _createClass(Manager, [{
    key: "init",
    value: function init() {
      this.spinner = new _Spinner["default"]();
      this.counter = new _Counter["default"]();
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

      //creation de la liste de fruits réduite à 14
      var fruits = ['pomme', 'banane', 'orange', 'citronVert', 'grenade', 'abricot', 'citronJaune', 'fraise', 'pomme', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise', 'mangue', 'bigarot'];
      this.tools.randomizeArray(fruits).slice(14); //positions aléatoires

      var ranks = this.tools.randomizeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]); //creation du tableau de cartes aléatoire

      var elements = [];
      var fruitIndex = 0;

      for (var i = 0; i < 28; i++) {
        elements[ranks[i]] = new _Card["default"](i, fruits[fruitIndex]).element; //toutes les 2 cartes, on change de fruit

        if (i % 2 === 1) fruitIndex++;
      } //ajout du html dans la div plateau


      (0, _jquery["default"])(".board").append(elements);
      setTimeout(function () {
        _this2.tools.showDecal(".card", 50);
      }, 300);
    }
  }, {
    key: "showBackdrop",
    value: function showBackdrop(duration, func) {
      (0, _jquery["default"])(".backdrop").addClass("show");
      if (typeof func === "function") func.apply(this);
      setTimeout(function () {
        (0, _jquery["default"])(".backdrop").removeClass("show");
      }, duration);
    }
  }, {
    key: "showScores",
    value: function showScores() {
      this.showBackdrop(3000);
    }
  }, {
    key: "checkKey",
    value: function checkKey(event) {
      if (event.key === "Enter") this.startGame();
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var _this3 = this;

      this.gameStarted = true;
      (0, _jquery["default"])(".backdrop").removeClass("show");
      (0, _jquery["default"])(".error").html("");
      var val = parseInt((0, _jquery["default"])(".current #duration").val(), 10);

      if (!val) {
        (0, _jquery["default"])(".error").html("Oups ... J'ai pas compris !");
        (0, _jquery["default"])(".current #duration").val("");
      } else if (val > 59) {
        (0, _jquery["default"])(".error").html("Faut pas exag&eacute;rer ... 59 minutes max !");
        (0, _jquery["default"])(".current #duration").val("");
      } else {
        setTimeout(function () {
          var duration = val * 60;
          (0, _jquery["default"])(".beforeCount").css({
            display: "none"
          });
          (0, _jquery["default"])(".counting").css({
            display: "flex"
          });

          _this3.counter.start(duration);

          _this3.update();
        }, 300);
      }
    }
  }, {
    key: "spin",
    value: function spin(target) {
      var _this4 = this;

      //on ne retourne une carte que si moins de 2 cartes sont retournées
      //et si cette carte n'est pas déjà retournée
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
              if (!_this4.gameEnded) _this4.nbClicks = 0;
            }, 2000);
          } //si toutes les cartes sont retournées, on clôture le jeu


          if (this.nbPairs === 14) {
            this.gameLasted = this.counter.lasted;
            console.dir(this.counter);
            console.log(this.gameLasted);
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
      this.gameEnded = true;
      setTimeout(function () {
        (0, _jquery["default"])(".counting").css({
          display: "none"
        });
        (0, _jquery["default"])(".again").css({
          display: "flex"
        });
        (0, _jquery["default"])(".discover").addClass("showDiscovered");
        (0, _jquery["default"])(".card").removeClass("recover").removeClass("discover");

        if (won) {
          _this5.showBackdrop(5000, function () {
            (0, _jquery["default"])(".backdrop").html("Bravo, c'est gagn&eacute; !!!<br />Vous avez trouv&eacute; en ".concat(_this5.gameLasted, " minute(s)"));
          });
        } else {
          _this5.showBackdrop(5000, function () {
            (0, _jquery["default"])(".backdrop").html("Arf ..., c'est perdu !");
          });
        }
      }, 500);
    }
  }, {
    key: "update",
    value: function update() {
      var _this6 = this;

      if (!this.gameEnded && this.counter && this.counter.started) {
        if (this.counter.ended) {
          this.endGame(false);
          this.gameLasted = this.counter.lasted;
          console.dir(this.counter);
          console.log(this.gameLasted);
          this.counter = null;
        } else this.counter.update();
      }

      requestAnimationFrame(function () {
        return _this6.update();
      });
    }
  }]);

  return Manager;
}();

module.exports = Manager;
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
      this.toggle([target], "recover", "discover", "none");
      if (stored) this.eval(target, stored);
    }
  }, {
    key: "eval",
    value: function _eval(target, stored) {
      var _this = this;

      this.pair = true;

      if (target.className !== stored.className) {
        this.pair = false;
        setTimeout(function () {
          _this.toggle([target, stored], "discover", "recover", "block");
        }, 1500);
      }
    }
  }, {
    key: "toggle",
    value: function toggle(targets, from, to, display, stored) {
      (0, _jquery["default"])(targets[0]).removeClass(from).addClass(to);
      if (targets[1]) (0, _jquery["default"])(targets[1]).removeClass(from).addClass(to);
      setTimeout(function () {
        (0, _jquery["default"])("#" + targets[0].id + " > img").css({
          display: display
        });

        if (targets[1]) {
          (0, _jquery["default"])("#" + targets[1].id + " > img").css({
            display: display
          });
        }
      }, 250);
    }
  }]);

  return Spinner;
}();

var _default = Spinner;
exports["default"] = _default;
});

require.register("js/utils.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideDecal = exports.showDecal = exports.release = exports.press = exports.checkDuration = exports.randomizeArray = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var randomizeArray = function randomizeArray(array) {
  array.sort(function () {
    return .5 - Math.random();
  });
  return array;
};

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
};

exports.checkDuration = checkDuration;

var press = function press(event) {
  (0, _jquery["default"])(event.target).removeClass("released").addClass("pressed");
};

exports.press = press;

var release = function release(event) {
  (0, _jquery["default"])(event.target).removeClass("pressed").addClass("released");
};

exports.release = release;

var showDecal = function showDecal(selector, delay) {
  (0, _jquery["default"])(selector).each(function (id, element) {
    (0, _jquery["default"])(element).attr("class", (0, _jquery["default"])(element).attr("class").replace(new RegExp("hide", 'g'), "show")).css({
      "transition-delay": id * (delay ? delay : 100) + "ms"
    });
  });
};

exports.showDecal = showDecal;

var hideDecal = function hideDecal(selector, delay) {
  var from = (0, _jquery["default"])(selector).length * (delay ? delay : 100);
  (0, _jquery["default"])(selector).each(function (id, element) {
    (0, _jquery["default"])(element).attr("class", (0, _jquery["default"])(element).attr("class").replace(new RegExp("show", 'g'), "hide")).css({
      "transition-delay": from - id * (delay ? delay : 100) + "ms"
    });
  });
};

exports.hideDecal = hideDecal;
});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=index.js.map