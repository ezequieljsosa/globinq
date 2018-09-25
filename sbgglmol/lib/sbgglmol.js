(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("sbgglmol", [], factory);
	else if(typeof exports === 'object')
		exports["sbgglmol"] = factory();
	else
		root["sbgglmol"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StickStyle = exports.StickStyle = function () {
	function StickStyle(colorer) {
		_classCallCheck(this, StickStyle);

		this.colorer = colorer;
		this.bondRadius = 0.2;
		this.atomRadius = 0.4;
		this.ignoreNonbonded = true;
		this.multipleBonds = false;
		this.scale = 0.3;
	}

	_createClass(StickStyle, [{
		key: "render",
		value: function render(glmol, atoms) {
			this.colorer.color(glmol, atoms);
			//var residues = glmol.getResidues(atoms);
			glmol.drawBondsAsStick(glmol.modelGroup, atoms, this.bondRadius, this.atomRadius, this.ignoreNonbonded, this.multipleBonds, this.scale);
		}
	}]);

	return StickStyle;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SphereStyle = exports.SphereStyle = function () {
	function SphereStyle(colorer, sphereRadius) {
		_classCallCheck(this, SphereStyle);

		this.colorer = colorer;
		this.sphereRadius = sphereRadius;
	}

	_createClass(SphereStyle, [{
		key: "render",
		value: function render(glmol, atoms) {
			this.colorer.color(glmol, atoms);
			glmol.drawAtomsAsSphere(glmol.modelGroup, atoms, this.sphereRadius, this.sphereRadius * glmol.thickness);
		}
	}]);

	return SphereStyle;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AtomColorer = exports.AtomColorer = function () {
	function AtomColorer(color) {
		_classCallCheck(this, AtomColorer);

		this._color = color;
	}

	_createClass(AtomColorer, [{
		key: "color",
		value: function color(glmol, atoms) {
			glmol.colorAtoms(atoms, this._color);
		}
	}]);

	return AtomColorer;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.GLmol = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      GLmol - Molecular Viewer on WebGL/Javascript (0.47)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       (C) Copyright 2011-2012, biochem_fan
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           License: dual license of MIT or LGPL3
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Contributors:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Robert Hanson for parseXYZ, deferred instantiation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       This program uses
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Three.js 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              https://github.com/mrdoob/three.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              Copyright (c) 2010-2012 three.js Authors. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           jQuery
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              http://jquery.org/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              Copyright (c) 2011 John Resig
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Workaround for Intel GMA series (gl_FrontFacing causes compilation error)

var _StickStyle = __webpack_require__(0);

var _SphereStyle = __webpack_require__(1);

var _Pocket = __webpack_require__(4);

var _AtomColorer = __webpack_require__(2);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TV3 = THREE.Vector3,
    TF3 = THREE.Face3,
    TCo = THREE.Color;

var vs_billboard = "uniform float width, height;\nvarying vec2 vUv;\n" + "void main() {\n mat4 mv = modelViewMatrix;\n mv[0][0] = mv[1][1] = mv[2][2] = 1.0;\n" + "mv[0][1] = mv[0][2] = mv[1][0] = mv[1][2] = mv[2][0] =  mv[2][1] = 0.0;\n" + "mat4 mat = projectionMatrix * mv;\n vUv = uv;\n" + "float aspect = projectionMatrix[1][1] / projectionMatrix[0][0];\n" + "gl_Position = mat * vec4(position, 1.0);\n gl_Position /= gl_Position.w;\n" + "gl_Position += vec4(uv.x * width / 1000.0, uv.y * height * aspect / 1000.0, 0.0, 0.0);\n" + "gl_Position.z = -0.9;\n}";

var fs_billboard = "uniform sampler2D map;\n varying vec2 vUv;\n" + "void main() {\n gl_FragColor = texture2D(map, vec2(vUv.x, 1.0 - vUv.y));\n" + "if (gl_FragColor.a < 0.5) discard;// else gl_FragColor = vec4(1.0, 1.0, 1.0, gl_FragColor.a);\n }";

var GLmol = exports.GLmol = function () {
   function GLmol(id, suppressAutoload) {
      _classCallCheck(this, GLmol);

      this.selected_atoms_color = parseInt("0x9F00FF");
      this.selected_atoms = [];
      this.layers = [];
      this.selected_atoms = [];
      this.atom_labels = [];
      this.selected_atoms_bond_renderer = new _StickStyle.StickStyle(new _AtomColorer.AtomColorer(this.selected_atoms_color));
      this.selected_atoms_renderer = new _SphereStyle.SphereStyle(new _AtomColorer.AtomColorer(this.selected_atoms_color), 0.1);

      if (id) {
         this.create(id, suppressAutoload);
      };
   }

   _createClass(GLmol, [{
      key: 'create',
      value: function create(id, suppressAutoload) {
         this.Nucleotides = ['  G', '  A', '  T', '  C', '  U', ' DG', ' DA', ' DT', ' DC', ' DU'];
         this.ElementColors = { "H": 0xCCCCCC, "C": 0xAAAAAA, "O": 0xCC0000, "N": 0x0000CC, "S": 0xCCCC00, "P": 0x6622CC,
            "F": 0x00CC00, "CL": 0x00CC00, "BR": 0x882200, "I": 0x6600AA,
            "FE": 0xCC6600, "CA": 0x8888AA };
         // Reference: A. Bondi, J. Phys. Chem., 1964, 68, 441.
         this.vdwRadii = { "H": 1.2, "Li": 1.82, "Na": 2.27, "K": 2.75, "C": 1.7, "N": 1.55, "O": 1.52,
            "F": 1.47, "P": 1.80, "S": 1.80, "CL": 1.75, "BR": 1.85, "SE": 1.90,
            "ZN": 1.39, "CU": 1.4, "NI": 1.63 };

         this.id = id;
         this.aaScale = 1; // or 2

         this.container = $('#' + this.id);
         this.WIDTH = this.container.width() * this.aaScale, this.HEIGHT = this.container.height() * this.aaScale;
         this.ASPECT = this.WIDTH / this.HEIGHT;
         this.NEAR = 1, this.FAR = 800;
         this.CAMERA_Z = -150;
         this.renderer = new THREE.WebGLRenderer({ antialias: true });
         this.renderer.sortObjects = false; // hopefully improve performance
         // 'antialias: true' now works in Firefox too!
         // setting this.aaScale = 2 will enable antialias in older Firefox but GPU
         // load increases.
         this.renderer.domElement.style.width = "100%";
         this.renderer.domElement.style.height = "100%";
         this.container.append(this.renderer.domElement);
         this.renderer.setSize(this.WIDTH, this.HEIGHT);

         this.camera = new THREE.PerspectiveCamera(20, this.ASPECT, 1, 800); // will
         // be
         // updated
         // anyway
         this.camera.position = new TV3(0, 0, this.CAMERA_Z);

         this.camera.lookAt(new TV3(0, 0, 0));
         this.perspectiveCamera = this.camera;
         this.orthoscopicCamera = new THREE.OrthographicCamera();
         this.orthoscopicCamera.position.z = this.CAMERA_Z;
         this.orthoscopicCamera.lookAt(new TV3(0, 0, 0));

         var self = this;
         $(window).resize(function () {
            // only window can capture resize event
            self.WIDTH = self.container.width() * self.aaScale;
            self.HEIGHT = self.container.height() * self.aaScale;
            self.ASPECT = self.WIDTH / self.HEIGHT;
            self.renderer.setSize(self.WIDTH, self.HEIGHT);
            self.camera.aspect = self.ASPECT;
            self.camera.updateProjectionMatrix();
            self.show();
         });

         this.scene = null;
         this.rotationGroup = null; // which contains modelGroup
         this.modelGroup = null;

         this.bgColor = 0x000000;
         this.fov = 20;
         this.fogStart = 0.4;
         this.slabNear = -50; // relative to the center of rotationGroup
         this.slabFar = +50;

         // Default values
         this.sphereRadius = 1.5;
         this.cylinderRadius = 0.4;
         this.lineWidth = 1.5 * this.aaScale;
         this.curveWidth = 3 * this.aaScale;
         this.defaultColor = 0xCCCCCC;
         this.sphereQuality = 16; // 16;
         this.cylinderQuality = 16; // 8;
         this.axisDIV = 5; // 3 still gives acceptable quality
         this.strandDIV = 6;
         this.nucleicAcidStrandDIV = 4;
         this.tubeDIV = 8;
         this.coilWidth = 0.3;
         this.helixSheetWidth = 1.3;
         this.nucleicAcidWidth = 0.8;
         this.thickness = 0.4;

         // UI variables
         this.cq = new THREE.Quaternion(1, 0, 0, 0);
         this.dq = new THREE.Quaternion(1, 0, 0, 0);
         this.isDragging = false;
         this.mouseStartX = 0;
         this.mouseStartY = 0;
         this.currentModelPos = 0;
         this.cz = 0;
         this.enableMouse();

         if (suppressAutoload) return;
         this.loadMolecule();
      }
   }, {
      key: 'setupLights',
      value: function setupLights(scene) {
         var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
         directionalLight.position = new TV3(0.2, 0.2, -1).normalize();

         directionalLight.intensity = 1.2;
         scene.add(directionalLight);
         var ambientLight = new THREE.AmbientLight(0x202020);
         scene.add(ambientLight);
      }
   }, {
      key: 'parseSDF',
      value: function parseSDF(str) {
         var atoms = this.atoms;
         var protein = this.protein;

         var lines = str.split("\n");
         if (lines.length < 4) return;
         var atomCount = parseInt(lines[3].substr(0, 3));
         if (isNaN(atomCount) || atomCount <= 0) return;
         var bondCount = parseInt(lines[3].substr(3, 3));
         var offset = 4;
         if (lines.length < 4 + atomCount + bondCount) return;
         for (var i = 1; i <= atomCount; i++) {
            var line = lines[offset];
            offset++;
            var atom = {};
            atom.serial = i;
            atom.x = parseFloat(line.substr(0, 10));
            atom.y = parseFloat(line.substr(10, 10));
            atom.z = parseFloat(line.substr(20, 10));
            atom.hetflag = true;
            atom.atom = atom.elem = line.substr(31, 3).replace(/ /g, "");
            atom.bonds = [];
            atom.bondOrder = [];
            atoms[i] = atom;
         }
         for (i = 1; i <= bondCount; i++) {
            var line = lines[offset];
            offset++;
            var from = parseInt(line.substr(0, 3));
            var to = parseInt(line.substr(3, 3));
            var order = parseInt(line.substr(6, 3));
            atoms[from].bonds.push(to);
            atoms[from].bondOrder.push(order);
            atoms[to].bonds.push(from);
            atoms[to].bondOrder.push(order);
         }

         protein.smallMolecule = true;
         return true;
      }
   }, {
      key: 'parseXYZ',
      value: function parseXYZ(str) {
         var atoms = this.atoms;
         var protein = this.protein;

         var lines = str.split("\n");
         if (lines.length < 3) return;
         var atomCount = parseInt(lines[0].substr(0, 3));
         if (isNaN(atomCount) || atomCount <= 0) return;
         if (lines.length < atomCount + 2) return;
         var offset = 2;
         for (var i = 1; i <= atomCount; i++) {
            var line = lines[offset++];
            var tokens = line.replace(/^\s+/, "").replace(/\s+/g, " ").split(" ");
            console.log(tokens);
            var atom = {};

            atom.serial = i;
            atom.atom = atom.elem = tokens[0];
            atom.x = parseFloat(tokens[1]);
            atom.y = parseFloat(tokens[2]);
            atom.z = parseFloat(tokens[3]);
            atom.hetflag = true;
            atom.bonds = [];
            atom.bondOrder = [];
            atoms[i] = atom;
         }
         for (var i = 1; i < atomCount; i++) {
            // hopefully XYZ is small enough
            for (var j = i + 1; j <= atomCount; j++) {
               if (this.isConnected(atoms[i], atoms[j])) {
                  atoms[i].bonds.push(j);
                  atoms[i].bondOrder.push(1);
                  atoms[j].bonds.push(i);
                  atoms[j].bondOrder.push(1);
               }
            }
         }protein.smallMolecule = true;
         return true;
      }
   }, {
      key: 'parsePDB2',
      value: function parsePDB2(str) {
         var atoms = this.atoms;
         var protein = this.protein;
         var molID;

         var atoms_cnt = 0;
         var lines = str.split("\n");
         for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/^\s*/, ''); // remove indent
            var recordName = line.substr(0, 6);
            if (recordName == 'ATOM  ' || recordName == 'HETATM') {
               var _atoms$serial;

               var atom, resn, chain, resi, x, y, z, hetflag, elem, serial, altLoc, b;
               altLoc = line.substr(16, 1);
               if (altLoc != ' ' && altLoc != 'A') continue; // FIXME: ad hoc

               var serial = line.substr(6, 5);
               if (/^[ 0-9]+$/.test(serial)) {
                  serial = parseInt(serial);
               } else {
                  serial = parseInt(serial, 16);
               }

               atom = line.substr(12, 4).replace(/ /g, "");
               resn = line.substr(17, 3);
               chain = line.substr(21, 1);
               resi = parseInt(line.substr(22, 5));
               x = parseFloat(line.substr(30, 8));
               y = parseFloat(line.substr(38, 8));
               z = parseFloat(line.substr(46, 8));
               b = parseFloat(line.substr(60, 8));
               elem = line.substr(76, 2).replace(/ /g, "");
               if (elem == '') {
                  // for some incorrect PDB files
                  elem = line.substr(12, 4).replace(/ /g, "");
               }
               if (line[0] == 'H') hetflag = true;else hetflag = false;
               atoms[serial] = (_atoms$serial = { 'resn': resn, 'x': x, 'y': y, 'z': z, 'elem': elem,
                  'hetflag': hetflag, 'chain': chain, 'resi': resi, 'serial': serial, 'atom': atom,
                  'bonds': [], 'ss': 'c', 'color': 0xFFFFFF }, _defineProperty(_atoms$serial, 'bonds', []), _defineProperty(_atoms$serial, 'bondOrder', []), _defineProperty(_atoms$serial, 'b', b), _atoms$serial);
            } else if (recordName == 'SHEET ') {
               var startChain = line.substr(21, 1);
               var startResi = parseInt(line.substr(22, 4));
               var endChain = line.substr(32, 1);
               var endResi = parseInt(line.substr(33, 4));
               protein.sheet.push([startChain, startResi, endChain, endResi]);
            } else if (recordName == 'CONECT') {
               // MEMO: We don't have to parse SSBOND, LINK because both are also
               // described in CONECT. But what about 2JYT???
               var from = parseInt(line.substr(6, 5));
               for (var j = 0; j < 4; j++) {
                  var to = parseInt(line.substr([11, 16, 21, 26][j], 5));
                  if (isNaN(to)) continue;
                  if (atoms[from] != undefined) {
                     atoms[from].bonds.push(to);
                     atoms[from].bondOrder.push(1);
                  }
               }
            } else if (recordName == 'HELIX ') {
               var startChain = line.substr(19, 1);
               var startResi = parseInt(line.substr(21, 4));
               var endChain = line.substr(31, 1);
               var endResi = parseInt(line.substr(33, 4));
               protein.helix.push([startChain, startResi, endChain, endResi]);
            } else if (recordName == 'CRYST1') {
               protein.a = parseFloat(line.substr(6, 9));
               protein.b = parseFloat(line.substr(15, 9));
               protein.c = parseFloat(line.substr(24, 9));
               protein.alpha = parseFloat(line.substr(33, 7));
               protein.beta = parseFloat(line.substr(40, 7));
               protein.gamma = parseFloat(line.substr(47, 7));
               protein.spacegroup = line.substr(55, 11);
               this.defineCell();
            } else if (recordName == 'REMARK') {
               var type = parseInt(line.substr(7, 3));
               if (type == 290 && line.substr(13, 5) == 'SMTRY') {
                  var n = parseInt(line[18]) - 1;
                  var m = parseInt(line.substr(21, 2));
                  if (protein.symMat[m] == undefined) protein.symMat[m] = new THREE.Matrix4().identity();
                  protein.symMat[m].elements[n] = parseFloat(line.substr(24, 9));
                  protein.symMat[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                  protein.symMat[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                  protein.symMat[m].elements[n + 12] = parseFloat(line.substr(54, 10));
               } else if (type == 350 && line.substr(13, 5) == 'BIOMT') {
                  var n = parseInt(line[18]) - 1;
                  var m = parseInt(line.substr(21, 2));
                  if (protein.biomtMatrices[m] == undefined) protein.biomtMatrices[m] = new THREE.Matrix4().identity();
                  protein.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
                  protein.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                  protein.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                  protein.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
               } else if (type == 350 && line.substr(11, 11) == 'BIOMOLECULE') {
                  protein.biomtMatrices = [];protein.biomtChains = '';
               } else if (type == 350 && line.substr(34, 6) == 'CHAINS') {
                  protein.biomtChains += line.substr(41, 40);
               }
            } else if (recordName == 'HEADER') {
               protein.pdbID = line.substr(62, 4);
            } else if (recordName == 'TITLE ') {
               if (protein.title == undefined) protein.title = "";
               protein.title += line.substr(10, 70) + "\n"; // CHECK: why 60 is
               // not enough???
            } else if (recordName == 'COMPND') {
               // TODO: Implement me!
            }
         }

         // Assign secondary structures
         for (i = 0; i < atoms.length; i++) {
            atom = atoms[i];if (atom == undefined) continue;

            var found = false;
            // MEMO: Can start chain and end chain differ?
            for (j = 0; j < protein.sheet.length; j++) {
               if (atom.chain != protein.sheet[j][0]) continue;
               if (atom.resi < protein.sheet[j][1]) continue;
               if (atom.resi > protein.sheet[j][3]) continue;
               atom.ss = 's';
               if (atom.resi == protein.sheet[j][1]) atom.ssbegin = true;
               if (atom.resi == protein.sheet[j][3]) atom.ssend = true;
            }
            for (j = 0; j < protein.helix.length; j++) {
               if (atom.chain != protein.helix[j][0]) continue;
               if (atom.resi < protein.helix[j][1]) continue;
               if (atom.resi > protein.helix[j][3]) continue;
               atom.ss = 'h';
               if (atom.resi == protein.helix[j][1]) atom.ssbegin = true;else if (atom.resi == protein.helix[j][3]) atom.ssend = true;
            }
         }
         protein.smallMolecule = false;
         return true;
      }

      // Catmull-Rom subdivision

   }, {
      key: 'subdivide',
      value: function subdivide(_points, DIV) {
         // points as Vector3
         var ret = [];
         var points = _points;
         points = new Array(); // Smoothing test
         points.push(_points[0]);
         for (var i = 1, lim = _points.length - 1; i < lim; i++) {
            var p1 = _points[i],
                p2 = _points[i + 1];
            if (p1.smoothen) points.push(new TV3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2));else points.push(p1);
         }
         points.push(_points[_points.length - 1]);

         for (var i = -1, size = points.length; i <= size - 3; i++) {
            var p0 = points[i == -1 ? 0 : i];
            var p1 = points[i + 1],
                p2 = points[i + 2];
            var p3 = points[i == size - 3 ? size - 1 : i + 3];
            var v0 = new TV3().sub(p2, p0).multiplyScalar(0.5);
            var v1 = new TV3().sub(p3, p1).multiplyScalar(0.5);
            for (var j = 0; j < DIV; j++) {
               var t = 1.0 / DIV * j;
               var x = p1.x + t * v0.x + t * t * (-3 * p1.x + 3 * p2.x - 2 * v0.x - v1.x) + t * t * t * (2 * p1.x - 2 * p2.x + v0.x + v1.x);
               var y = p1.y + t * v0.y + t * t * (-3 * p1.y + 3 * p2.y - 2 * v0.y - v1.y) + t * t * t * (2 * p1.y - 2 * p2.y + v0.y + v1.y);
               var z = p1.z + t * v0.z + t * t * (-3 * p1.z + 3 * p2.z - 2 * v0.z - v1.z) + t * t * t * (2 * p1.z - 2 * p2.z + v0.z + v1.z);
               ret.push(new TV3(x, y, z));
            }
         }
         ret.push(points[points.length - 1]);
         return ret;
      }
   }, {
      key: 'drawAtomsAsSphere',
      value: function drawAtomsAsSphere(group, atomlist, defaultRadius, forceDefault, scale) {
         var sphereGeometry = new THREE.SphereGeometry(1, this.sphereQuality, this.sphereQuality); // r,
         // seg,
         // ring
         for (var i = 0; i < atomlist.length; i++) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            var sphereMaterial = new THREE.MeshLambertMaterial({ color: atom.color });
            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            group.add(sphere);
            var r = !forceDefault && this.vdwRadii[atom.elem] != undefined ? this.vdwRadii[atom.elem] : defaultRadius;
            if (!forceDefault && scale) r *= scale;
            sphere.scale.x = sphere.scale.y = sphere.scale.z = r;
            sphere.position.x = atom.x;
            sphere.position.y = atom.y;
            sphere.position.z = atom.z;
         }
      }

      // about two times faster than sphere when div = 2

   }, {
      key: 'drawAtomsAsIcosahedron',
      value: function drawAtomsAsIcosahedron(group, atomlist, defaultRadius, forceDefault) {
         var geo = this.IcosahedronGeometry();
         for (var i = 0; i < atomlist.length; i++) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            var mat = new THREE.MeshLambertMaterial({ color: atom.color });
            var sphere = new THREE.Mesh(geo, mat);
            sphere.scale.x = sphere.scale.y = sphere.scale.z = !forceDefault && this.vdwRadii[atom.elem] != undefined ? this.vdwRadii[atom.elem] : defaultRadius;
            group.add(sphere);
            sphere.position.x = atom.x;
            sphere.position.y = atom.y;
            sphere.position.z = atom.z;
         }
      }
   }, {
      key: 'isConnected',
      value: function isConnected(atom1, atom2) {
         var s = atom1.bonds.indexOf(atom2.serial);
         if (s != -1) return atom1.bondOrder[s];

         if (this.protein.smallMolecule && (atom1.hetflag || atom2.hetflag)) return 0; // CHECK:
         // or
         // should
         // I ?

         var distSquared = (atom1.x - atom2.x) * (atom1.x - atom2.x) + (atom1.y - atom2.y) * (atom1.y - atom2.y) + (atom1.z - atom2.z) * (atom1.z - atom2.z);

         // if (atom1.altLoc != atom2.altLoc) return false;
         if (isNaN(distSquared)) return 0;
         if (distSquared < 0.5) return 0; // maybe duplicate position.

         if (distSquared > 1.3 && (atom1.elem == 'H' || atom2.elem == 'H' || atom1.elem == 'D' || atom2.elem == 'D')) return 0;
         if (distSquared < 3.42 && (atom1.elem == 'S' || atom2.elem == 'S')) return 1;
         if (distSquared > 2.78) return 0;
         return 1;
      }
   }, {
      key: 'drawBondAsStickSub',
      value: function drawBondAsStickSub(group, atom1, atom2, bondR, order) {
         var delta, tmp;
         if (order > 1) delta = this.calcBondDelta(atom1, atom2, bondR * 2.3);
         var p1 = new TV3(atom1.x, atom1.y, atom1.z);
         var p2 = new TV3(atom2.x, atom2.y, atom2.z);
         var mp = p1.clone().addSelf(p2).multiplyScalar(0.5);

         var c1 = new TCo(atom1.color),
             c2 = new TCo(atom2.color);
         if (order == 1 || order == 3) {
            this.drawCylinder(group, p1, mp, bondR, atom1.color);
            this.drawCylinder(group, p2, mp, bondR, atom2.color);
         }
         if (order > 1) {
            tmp = mp.clone().addSelf(delta);
            this.drawCylinder(group, p1.clone().addSelf(delta), tmp, bondR, atom1.color);
            this.drawCylinder(group, p2.clone().addSelf(delta), tmp, bondR, atom2.color);
            tmp = mp.clone().subSelf(delta);
            this.drawCylinder(group, p1.clone().subSelf(delta), tmp, bondR, atom1.color);
            this.drawCylinder(group, p2.clone().subSelf(delta), tmp, bondR, atom2.color);
         }
      }
   }, {
      key: 'drawBondsAsStick',
      value: function drawBondsAsStick(group, atomlist, bondR, atomR, ignoreNonbonded, multipleBonds, scale) {
         var sphereGeometry = new THREE.SphereGeometry(1, this.sphereQuality, this.sphereQuality);
         var nAtoms = atomlist.length,
             mp;
         var forSpheres = [];
         if (!!multipleBonds) bondR /= 2.5;
         for (var _i = 0; _i < nAtoms; _i++) {
            var i = atomlist[_i];
            var atom1 = this.atoms[i];
            if (atom1 == undefined) continue;
            for (var _j = _i + 1; _j < _i + 30 && _j < nAtoms; _j++) {
               var j = atomlist[_j];
               var atom2 = this.atoms[j];
               if (atom2 == undefined) continue;
               var order = this.isConnected(atom1, atom2);
               if (order == 0) continue;
               atom1.connected = atom2.connected = true;
               this.drawBondAsStickSub(group, atom1, atom2, bondR, !!multipleBonds ? order : 1);
            }
            for (var _j = 0; _j < atom1.bonds.length; _j++) {
               var j = atom1.bonds[_j];
               if (j < i + 30) continue; // be conservative!
               if (atomlist.indexOf(j) == -1) continue;
               var atom2 = this.atoms[j];
               if (atom2 == undefined) continue;
               atom1.connected = atom2.connected = true;
               this.drawBondAsStickSub(group, atom1, atom2, bondR, !!multipleBonds ? atom1.bondOrder[_j] : 1);
            }
            if (atom1.connected) forSpheres.push(i);
         }
         this.drawAtomsAsSphere(group, forSpheres, atomR, !scale, scale);
      }
   }, {
      key: 'defineCell',
      value: function defineCell() {
         var p = this.protein;
         if (p.a == undefined) return;

         p.ax = p.a;
         p.ay = 0;
         p.az = 0;
         p.bx = p.b * Math.cos(Math.PI / 180.0 * p.gamma);
         p.by = p.b * Math.sin(Math.PI / 180.0 * p.gamma);
         p.bz = 0;
         p.cx = p.c * Math.cos(Math.PI / 180.0 * p.beta);
         p.cy = p.c * (Math.cos(Math.PI / 180.0 * p.alpha) - Math.cos(Math.PI / 180.0 * p.gamma) * Math.cos(Math.PI / 180.0 * p.beta) / Math.sin(Math.PI / 180.0 * p.gamma));
         p.cz = Math.sqrt(p.c * p.c * Math.sin(Math.PI / 180.0 * p.beta) * Math.sin(Math.PI / 180.0 * p.beta) - p.cy * p.cy);
      }
   }, {
      key: 'drawUnitcell',
      value: function drawUnitcell(group) {
         var p = this.protein;
         if (p.a == undefined) return;

         var vertices = [[0, 0, 0], [p.ax, p.ay, p.az], [p.bx, p.by, p.bz], [p.ax + p.bx, p.ay + p.by, p.az + p.bz], [p.cx, p.cy, p.cz], [p.cx + p.ax, p.cy + p.ay, p.cz + p.az], [p.cx + p.bx, p.cy + p.by, p.cz + p.bz], [p.cx + p.ax + p.bx, p.cy + p.ay + p.by, p.cz + p.az + p.bz]];
         var edges = [0, 1, 0, 2, 1, 3, 2, 3, 4, 5, 4, 6, 5, 7, 6, 7, 0, 4, 1, 5, 2, 6, 3, 7];

         var geo = new THREE.Geometry();
         for (var i = 0; i < edges.length; i++) {
            geo.vertices.push(new TV3(vertices[edges[i]][0], vertices[edges[i]][1], vertices[edges[i]][2]));
         }
         var lineMaterial = new THREE.LineBasicMaterial({ linewidth: 1, color: 0xcccccc });
         var line = new THREE.Line(geo, lineMaterial);
         line.type = THREE.LinePieces;
         group.add(line);
      }

      // TODO: Find inner side of a ring

   }, {
      key: 'calcBondDelta',
      value: function calcBondDelta(atom1, atom2, sep) {
         var dot;
         var axis = new TV3(atom1.x - atom2.x, atom1.y - atom2.y, atom1.z - atom2.z).normalize();
         var found = null;
         for (var i = 0; i < atom1.bonds.length && !found; i++) {
            var atom = this.atoms[atom1.bonds[i]];if (!atom) continue;
            if (atom.serial != atom2.serial && atom.elem != 'H') found = atom;
         }
         for (var i = 0; i < atom2.bonds.length && !found; i++) {
            var atom = this.atoms[atom2.bonds[i]];if (!atom) continue;
            if (atom.serial != atom1.serial && atom.elem != 'H') found = atom;
         }
         if (found) {
            var tmp = new TV3(atom1.x - found.x, atom1.y - found.y, atom1.z - found.z).normalize();
            dot = tmp.dot(axis);
            delta = new TV3(tmp.x - axis.x * dot, tmp.y - axis.y * dot, tmp.z - axis.z * dot);
         }
         if (!found || Math.abs(dot - 1) < 0.001 || Math.abs(dot + 1) < 0.001) {
            if (axis.x < 0.01 && axis.y < 0.01) {
               delta = new TV3(0, -axis.z, axis.y);
            } else {
               delta = new TV3(-axis.y, axis.x, 0);
            }
         }
         delta.normalize().multiplyScalar(sep);
         return delta;
      }
   }, {
      key: 'drawBondsAsLineSub',
      value: function drawBondsAsLineSub(geo, atom1, atom2, order) {
         var delta,
             tmp,
             vs = geo.vertices,
             cs = geo.colors;
         if (order > 1) delta = this.calcBondDelta(atom1, atom2, 0.15);
         var p1 = new TV3(atom1.x, atom1.y, atom1.z);
         var p2 = new TV3(atom2.x, atom2.y, atom2.z);
         var mp = p1.clone().addSelf(p2).multiplyScalar(0.5);

         var c1 = new TCo(atom1.color),
             c2 = new TCo(atom2.color);
         if (order == 1 || order == 3) {
            vs.push(p1);cs.push(c1);vs.push(mp);cs.push(c1);
            vs.push(p2);cs.push(c2);vs.push(mp);cs.push(c2);
         }
         if (order > 1) {
            vs.push(p1.clone().addSelf(delta));cs.push(c1);
            vs.push(tmp = mp.clone().addSelf(delta));cs.push(c1);
            vs.push(p2.clone().addSelf(delta));cs.push(c2);
            vs.push(tmp);cs.push(c2);
            vs.push(p1.clone().subSelf(delta));cs.push(c1);
            vs.push(tmp = mp.clone().subSelf(delta));cs.push(c1);
            vs.push(p2.clone().subSelf(delta));cs.push(c2);
            vs.push(tmp);cs.push(c2);
         }
      }
   }, {
      key: 'drawBondsAsLine',
      value: function drawBondsAsLine(group, atomlist, lineWidth) {
         var geo = new THREE.Geometry();
         var nAtoms = atomlist.length;

         for (var _i = 0; _i < nAtoms; _i++) {
            var i = atomlist[_i];
            var atom1 = this.atoms[i];
            if (atom1 == undefined) continue;
            for (var _j = _i + 1; _j < _i + 30 && _j < nAtoms; _j++) {
               var j = atomlist[_j];
               var atom2 = this.atoms[j];
               if (atom2 == undefined) continue;
               var order = this.isConnected(atom1, atom2);
               if (order == 0) continue;

               this.drawBondsAsLineSub(geo, atom1, atom2, order);
            }
            for (var _j = 0; _j < atom1.bonds.length; _j++) {
               var j = atom1.bonds[_j];
               if (j < i + 30) continue; // be conservative!
               if (atomlist.indexOf(j) == -1) continue;
               var atom2 = this.atoms[j];
               if (atom2 == undefined) continue;
               this.drawBondsAsLineSub(geo, atom1, atom2, atom1.bondOrder[_j]);
            }
         }
         var lineMaterial = new THREE.LineBasicMaterial({ linewidth: lineWidth });
         lineMaterial.vertexColors = true;

         var line = new THREE.Line(geo, lineMaterial);
         line.type = THREE.LinePieces;
         group.add(line);
      }
   }, {
      key: 'drawSmoothCurve',
      value: function drawSmoothCurve(group, _points, width, colors, div) {
         if (_points.length == 0) return;

         div = div == undefined ? 5 : div;

         var geo = new THREE.Geometry();
         var points = this.subdivide(_points, div);

         for (var i = 0; i < points.length; i++) {
            geo.vertices.push(points[i]);
            geo.colors.push(new TCo(colors[i == 0 ? 0 : Math.round((i - 1) / div)]));
         }
         var lineMaterial = new THREE.LineBasicMaterial({ linewidth: width });
         lineMaterial.vertexColors = true;
         var line = new THREE.Line(geo, lineMaterial);
         line.type = THREE.LineStrip;
         group.add(line);
      }
   }, {
      key: 'drawAsCross',
      value: function drawAsCross(group, atomlist, delta) {
         var geo = new THREE.Geometry();
         var points = [[delta, 0, 0], [-delta, 0, 0], [0, delta, 0], [0, -delta, 0], [0, 0, delta], [0, 0, -delta]];

         for (var i = 0, lim = atomlist.length; i < lim; i++) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            var c = new TCo(atom.color);
            for (var j = 0; j < 6; j++) {
               geo.vertices.push(new TV3(atom.x + points[j][0], atom.y + points[j][1], atom.z + points[j][2]));
               geo.colors.push(c);
            }
         }
         var lineMaterial = new THREE.LineBasicMaterial({ linewidth: this.lineWidth });
         lineMaterial.vertexColors = true;
         var line = new THREE.Line(geo, lineMaterial, THREE.LinePieces);
         group.add(line);
      }

      // FIXME: Winkled...

   }, {
      key: 'drawSmoothTube',
      value: function drawSmoothTube(group, _points, colors, radii) {
         if (_points.length < 2) return;

         var circleDiv = this.tubeDIV,
             axisDiv = this.axisDIV;
         var geo = new THREE.Geometry();
         var points = this.subdivide(_points, axisDiv);
         var prevAxis1 = new TV3(),
             prevAxis2;

         for (var i = 0, lim = points.length; i < lim; i++) {
            var r,
                idx = (i - 1) / axisDiv;
            if (i == 0) r = radii[0];else {
               if (idx % 1 == 0) r = radii[idx];else {
                  var floored = Math.floor(idx);
                  var tmp = idx - floored;
                  r = radii[floored] * tmp + radii[floored + 1] * (1 - tmp);
               }
            }
            var delta, axis1, axis2;

            if (i < lim - 1) {
               delta = new TV3().sub(points[i], points[i + 1]);
               axis1 = new TV3(0, -delta.z, delta.y).normalize().multiplyScalar(r);
               axis2 = new TV3().cross(delta, axis1).normalize().multiplyScalar(r);
               // var dir = 1, offset = 0;
               if (prevAxis1.dot(axis1) < 0) {
                  axis1.negate();axis2.negate(); // dir = -1;//offset = 2 *
                  // Math.PI / axisDiv;
               }
               prevAxis1 = axis1;prevAxis2 = axis2;
            } else {
               axis1 = prevAxis1;axis2 = prevAxis2;
            }

            for (var j = 0; j < circleDiv; j++) {
               var angle = 2 * Math.PI / circleDiv * j; // * dir + offset;
               var c = Math.cos(angle),
                   s = Math.sin(angle);
               geo.vertices.push(new TV3(points[i].x + c * axis1.x + s * axis2.x, points[i].y + c * axis1.y + s * axis2.y, points[i].z + c * axis1.z + s * axis2.z));
            }
         }

         var offset = 0;
         for (var i = 0, lim = points.length - 1; i < lim; i++) {
            var c = new TCo(colors[Math.round((i - 1) / axisDiv)]);

            var reg = 0;
            var r1 = new TV3().sub(geo.vertices[offset], geo.vertices[offset + circleDiv]).lengthSq();
            var r2 = new TV3().sub(geo.vertices[offset], geo.vertices[offset + circleDiv + 1]).lengthSq();
            if (r1 > r2) {
               r1 = r2;reg = 1;
            };
            for (var j = 0; j < circleDiv; j++) {
               geo.faces.push(new TF3(offset + j, offset + (j + reg) % circleDiv + circleDiv, offset + (j + 1) % circleDiv));
               geo.faces.push(new TF3(offset + (j + 1) % circleDiv, offset + (j + reg) % circleDiv + circleDiv, offset + (j + reg + 1) % circleDiv + circleDiv));
               geo.faces[geo.faces.length - 2].color = c;
               geo.faces[geo.faces.length - 1].color = c;
            }
            offset += circleDiv;
         }
         geo.computeFaceNormals();
         geo.computeVertexNormals(false);
         var mat = new THREE.MeshLambertMaterial();
         mat.vertexColors = THREE.FaceColors;
         var mesh = new THREE.Mesh(geo, mat);
         mesh.doubleSided = true;
         group.add(mesh);
      }
   }, {
      key: 'drawMainchainCurve',
      value: function drawMainchainCurve(group, atomlist, curveWidth, atomName, div) {
         var points = [],
             colors = [];
         var currentChain, currentResi;
         if (div == undefined) div = 5;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if (atom.atom == atomName && !atom.hetflag) {
               if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                  this.drawSmoothCurve(group, points, curveWidth, colors, div);
                  points = [];
                  colors = [];
               }
               points.push(new TV3(atom.x, atom.y, atom.z));
               colors.push(atom.color);
               currentChain = atom.chain;
               currentResi = atom.resi;
            }
         }
         this.drawSmoothCurve(group, points, curveWidth, colors, div);
      }
   }, {
      key: 'drawMainchainTube',
      value: function drawMainchainTube(group, atomlist, atomName, radius) {
         var points = [],
             colors = [],
             radii = [];
         var currentChain, currentResi;
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if (atom.atom == atomName && !atom.hetflag) {
               if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                  this.drawSmoothTube(group, points, colors, radii);
                  points = [];colors = [];radii = [];
               }
               points.push(new TV3(atom.x, atom.y, atom.z));
               if (radius == undefined) {
                  radii.push(atom.b > 0 ? atom.b / 100 : 0.3);
               } else {
                  radii.push(radius);
               }
               colors.push(atom.color);
               currentChain = atom.chain;
               currentResi = atom.resi;
            }
         }
         this.drawSmoothTube(group, points, colors, radii);
      }
   }, {
      key: 'drawStrip',
      value: function drawStrip(group, p1, p2, colors, div, thickness) {
         if (p1.length < 2) return;
         div = div || this.axisDIV;
         p1 = this.subdivide(p1, div);
         p2 = this.subdivide(p2, div);
         if (!thickness) return this.drawThinStrip(group, p1, p2, colors, div);

         var geo = new THREE.Geometry();
         var vs = geo.vertices,
             fs = geo.faces;
         var axis, p1v, p2v, a1v, a2v;
         for (var i = 0, lim = p1.length; i < lim; i++) {
            vs.push(p1v = p1[i]); // 0
            vs.push(p1v); // 1
            vs.push(p2v = p2[i]); // 2
            vs.push(p2v); // 3
            if (i < lim - 1) {
               var toNext = p1[i + 1].clone().subSelf(p1[i]);
               var toSide = p2[i].clone().subSelf(p1[i]);
               axis = toSide.crossSelf(toNext).normalize().multiplyScalar(thickness);
            }
            vs.push(a1v = p1[i].clone().addSelf(axis)); // 4
            vs.push(a1v); // 5
            vs.push(a2v = p2[i].clone().addSelf(axis)); // 6
            vs.push(a2v); // 7
         }
         var faces = [[0, 2, -6, -8], [-4, -2, 6, 4], [7, 3, -5, -1], [-3, -7, 1, 5]];
         for (var i = 1, lim = p1.length; i < lim; i++) {
            var offset = 8 * i,
                color = new TCo(colors[Math.round((i - 1) / div)]);
            for (var j = 0; j < 4; j++) {
               var f = new THREE.Face4(offset + faces[j][0], offset + faces[j][1], offset + faces[j][2], offset + faces[j][3], undefined, color);
               fs.push(f);
            }
         }
         var vsize = vs.length - 8; // Cap
         for (var i = 0; i < 4; i++) {
            vs.push(vs[i * 2]);vs.push(vs[vsize + i * 2]);
         };
         vsize += 8;
         fs.push(new THREE.Face4(vsize, vsize + 2, vsize + 6, vsize + 4, undefined, fs[0].color));
         fs.push(new THREE.Face4(vsize + 1, vsize + 5, vsize + 7, vsize + 3, undefined, fs[fs.length - 3].color));
         geo.computeFaceNormals();
         geo.computeVertexNormals(false);
         var material = new THREE.MeshLambertMaterial();
         material.vertexColors = THREE.FaceColors;
         var mesh = new THREE.Mesh(geo, material);
         mesh.doubleSided = true;
         group.add(mesh);
      }
   }, {
      key: 'drawThinStrip',
      value: function drawThinStrip(group, p1, p2, colors, div) {
         var geo = new THREE.Geometry();
         for (var i = 0, lim = p1.length; i < lim; i++) {
            geo.vertices.push(p1[i]); // 2i
            geo.vertices.push(p2[i]); // 2i + 1
         }
         for (var i = 1, lim = p1.length; i < lim; i++) {
            var f = new THREE.Face4(2 * i, 2 * i + 1, 2 * i - 1, 2 * i - 2);
            f.color = new TCo(colors[Math.round((i - 1) / div)]);
            geo.faces.push(f);
         }
         geo.computeFaceNormals();
         geo.computeVertexNormals(false);
         var material = new THREE.MeshLambertMaterial();
         material.vertexColors = THREE.FaceColors;
         var mesh = new THREE.Mesh(geo, material);
         mesh.doubleSided = true;
         group.add(mesh);
      }
   }, {
      key: 'IcosahedronGeometry',
      value: function IcosahedronGeometry() {
         if (!this.icosahedron) this.icosahedron = new THREE.IcosahedronGeometry(1);
         return this.icosahedron;
      }
   }, {
      key: 'drawCylinder',
      value: function drawCylinder(group, from, to, radius, color, cap) {
         if (!from || !to) return;

         var midpoint = new TV3().add(from, to).multiplyScalar(0.5);
         var color = new TCo(color);

         if (!this.cylinderGeometry) {
            this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, this.cylinderQuality, 1, !cap);
            this.cylinderGeometry.faceUvs = [];
            this.faceVertexUvs = [];
         }
         var cylinderMaterial = new THREE.MeshLambertMaterial({ color: color.getHex() });
         var cylinder = new THREE.Mesh(this.cylinderGeometry, cylinderMaterial);
         cylinder.position = midpoint;
         cylinder.lookAt(from);
         cylinder.updateMatrix();
         cylinder.matrixAutoUpdate = false;
         var m = new THREE.Matrix4().makeScale(radius, radius, from.distanceTo(to));
         m.rotateX(Math.PI / 2);
         cylinder.matrix.multiplySelf(m);
         group.add(cylinder);
      }

      // FIXME: transition!

   }, {
      key: 'drawHelixAsCylinder',
      value: function drawHelixAsCylinder(group, atomlist, radius) {
         var start = null;
         var currentChain, currentResi;

         var others = [],
             beta = [];

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined || atom.hetflag) continue;
            if (atom.ss != 'h' && atom.ss != 's' || atom.ssend || atom.ssbegin) others.push(atom.serial);
            if (atom.ss == 's') beta.push(atom.serial);
            if (atom.atom != 'CA') continue;

            if (atom.ss == 'h' && atom.ssend) {
               if (start != null) this.drawCylinder(group, new TV3(start.x, start.y, start.z), new TV3(atom.x, atom.y, atom.z), radius, atom.color, true);
               start = null;
            }
            currentChain = atom.chain;
            currentResi = atom.resi;
            if (start == null && atom.ss == 'h' && atom.ssbegin) start = atom;
         }
         if (start != null) this.drawCylinder(group, new TV3(start.x, start.y, start.z), new TV3(atom.x, atom.y, atom.z), radius, atom.color);
         this.drawMainchainTube(group, others, "CA", 0.3);
         this.drawStrand(group, beta, undefined, undefined, true, 0, this.helixSheetWidth, false, this.thickness * 2);
      }
   }, {
      key: 'drawCartoon',
      value: function drawCartoon(group, atomlist, doNotSmoothen, thickness) {
         this.drawStrand(group, atomlist, 2, undefined, true, undefined, undefined, doNotSmoothen, thickness);
      }
   }, {
      key: 'drawStrand',
      value: function drawStrand(group, atomlist, num, div, fill, coilWidth, helixSheetWidth, doNotSmoothen, thickness) {
         num = num || this.strandDIV;
         div = div || this.axisDIV;
         coilWidth = coilWidth || this.coilWidth;
         doNotSmoothen == (doNotSmoothen == undefined) ? false : doNotSmoothen;
         helixSheetWidth = helixSheetWidth || this.helixSheetWidth;
         var points = [];for (var k = 0; k < num; k++) {
            points[k] = [];
         }var colors = [];
         var currentChain, currentResi, currentCA;
         var prevCO = null,
             ss = null,
             ssborder = false;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if ((atom.atom == 'O' || atom.atom == 'CA') && !atom.hetflag) {
               if (atom.atom == 'CA') {
                  if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                     for (var j = 0; !thickness && j < num; j++) {
                        this.drawSmoothCurve(group, points[j], 1, colors, div);
                     }if (fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
                     var points = [];for (var k = 0; k < num; k++) {
                        points[k] = [];
                     }colors = [];
                     prevCO = null;ss = null;ssborder = false;
                  }
                  currentCA = new TV3(atom.x, atom.y, atom.z);
                  currentChain = atom.chain;
                  currentResi = atom.resi;
                  ss = atom.ss;ssborder = atom.ssstart || atom.ssend;
                  colors.push(atom.color);
               } else {
                  // O
                  var O = new TV3(atom.x, atom.y, atom.z);
                  O.subSelf(currentCA);
                  O.normalize(); // can be omitted for performance
                  O.multiplyScalar(ss == 'c' ? coilWidth : helixSheetWidth);
                  if (prevCO != undefined && O.dot(prevCO) < 0) O.negate();
                  prevCO = O;
                  for (var j = 0; j < num; j++) {
                     var delta = -1 + 2 / (num - 1) * j;
                     var v = new TV3(currentCA.x + prevCO.x * delta, currentCA.y + prevCO.y * delta, currentCA.z + prevCO.z * delta);
                     if (!doNotSmoothen && ss == 's') v.smoothen = true;
                     points[j].push(v);
                  }
               }
            }
         }
         for (var j = 0; !thickness && j < num; j++) {
            this.drawSmoothCurve(group, points[j], 1, colors, div);
         }if (fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
      }
   }, {
      key: 'drawNucleicAcidLadderSub',
      value: function drawNucleicAcidLadderSub(geo, lineGeo, atoms, color) {
         // color.r *= 0.9; color.g *= 0.9; color.b *= 0.9;
         if (atoms[0] != undefined && atoms[1] != undefined && atoms[2] != undefined && atoms[3] != undefined && atoms[4] != undefined && atoms[5] != undefined) {
            var baseFaceId = geo.vertices.length;
            for (var i = 0; i <= 5; i++) {
               geo.vertices.push(atoms[i]);
            }geo.faces.push(new TF3(baseFaceId, baseFaceId + 1, baseFaceId + 2));
            geo.faces.push(new TF3(baseFaceId, baseFaceId + 2, baseFaceId + 3));
            geo.faces.push(new TF3(baseFaceId, baseFaceId + 3, baseFaceId + 4));
            geo.faces.push(new TF3(baseFaceId, baseFaceId + 4, baseFaceId + 5));
            for (var j = geo.faces.length - 4, lim = geo.faces.length; j < lim; j++) {
               geo.faces[j].color = color;
            }
         }
         if (atoms[4] != undefined && atoms[3] != undefined && atoms[6] != undefined && atoms[7] != undefined && atoms[8] != undefined) {
            var baseFaceId = geo.vertices.length;
            geo.vertices.push(atoms[4]);
            geo.vertices.push(atoms[3]);
            geo.vertices.push(atoms[6]);
            geo.vertices.push(atoms[7]);
            geo.vertices.push(atoms[8]);
            for (var i = 0; i <= 4; i++) {
               geo.colors.push(color);
            }geo.faces.push(new TF3(baseFaceId, baseFaceId + 1, baseFaceId + 2));
            geo.faces.push(new TF3(baseFaceId, baseFaceId + 2, baseFaceId + 3));
            geo.faces.push(new TF3(baseFaceId, baseFaceId + 3, baseFaceId + 4));
            for (var j = geo.faces.length - 3, lim = geo.faces.length; j < lim; j++) {
               geo.faces[j].color = color;
            }
         }
      }
   }, {
      key: 'drawNucleicAcidLadder',
      value: function drawNucleicAcidLadder(group, atomlist) {
         var geo = new THREE.Geometry();
         var lineGeo = new THREE.Geometry();
         var baseAtoms = ["N1", "C2", "N3", "C4", "C5", "C6", "N9", "C8", "N7"];
         var currentChain,
             currentResi,
             currentComponent = new Array(baseAtoms.length);
         var color = new TCo(0xcc0000);

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined || atom.hetflag) continue;

            if (atom.resi != currentResi || atom.chain != currentChain) {
               this.drawNucleicAcidLadderSub(geo, lineGeo, currentComponent, color);
               currentComponent = new Array(baseAtoms.length);
            }
            var pos = baseAtoms.indexOf(atom.atom);
            if (pos != -1) currentComponent[pos] = new TV3(atom.x, atom.y, atom.z);
            if (atom.atom == 'O3\'') color = new TCo(atom.color);
            currentResi = atom.resi;currentChain = atom.chain;
         }
         this.drawNucleicAcidLadderSub(geo, lineGeo, currentComponent, color);
         geo.computeFaceNormals();
         var mat = new THREE.MeshLambertMaterial();
         mat.vertexColors = THREE.VertexColors;
         var mesh = new THREE.Mesh(geo, mat);
         mesh.doubleSided = true;
         group.add(mesh);
      }
   }, {
      key: 'drawNucleicAcidStick',
      value: function drawNucleicAcidStick(group, atomlist) {
         var currentChain,
             currentResi,
             start = null,
             end = null;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined || atom.hetflag) continue;

            if (atom.resi != currentResi || atom.chain != currentChain) {
               if (start != null && end != null) this.drawCylinder(group, new TV3(start.x, start.y, start.z), new TV3(end.x, end.y, end.z), 0.3, start.color, true);
               start = null;end = null;
            }
            if (atom.atom == 'O3\'') start = atom;
            if (atom.resn == '  A' || atom.resn == '  G' || atom.resn == ' DA' || atom.resn == ' DG') {
               if (atom.atom == 'N1') end = atom; // N1(AG), N3(CTU)
            } else if (atom.atom == 'N3') {
               end = atom;
            }
            currentResi = atom.resi;currentChain = atom.chain;
         }
         if (start != null && end != null) this.drawCylinder(group, new TV3(start.x, start.y, start.z), new TV3(end.x, end.y, end.z), 0.3, start.color, true);
      }
   }, {
      key: 'drawNucleicAcidLine',
      value: function drawNucleicAcidLine(group, atomlist) {
         var currentChain,
             currentResi,
             start = null,
             end = null;
         var geo = new THREE.Geometry();

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined || atom.hetflag) continue;

            if (atom.resi != currentResi || atom.chain != currentChain) {
               if (start != null && end != null) {
                  geo.vertices.push(new TV3(start.x, start.y, start.z));
                  geo.colors.push(new TCo(start.color));
                  geo.vertices.push(new TV3(end.x, end.y, end.z));
                  geo.colors.push(new TCo(start.color));
               }
               start = null;end = null;
            }
            if (atom.atom == 'O3\'') start = atom;
            if (atom.resn == '  A' || atom.resn == '  G' || atom.resn == ' DA' || atom.resn == ' DG') {
               if (atom.atom == 'N1') end = atom; // N1(AG), N3(CTU)
            } else if (atom.atom == 'N3') {
               end = atom;
            }
            currentResi = atom.resi;currentChain = atom.chain;
         }
         if (start != null && end != null) {
            geo.vertices.push(new TV3(start.x, start.y, start.z));
            geo.colors.push(new TCo(start.color));
            geo.vertices.push(new TV3(end.x, end.y, end.z));
            geo.colors.push(new TCo(start.color));
         }
         var mat = new THREE.LineBasicMaterial({ linewidth: 1, linejoin: false });
         mat.linewidth = 1.5;mat.vertexColors = true;
         var line = new THREE.Line(geo, mat, THREE.LinePieces);
         group.add(line);
      }
   }, {
      key: 'drawCartoonNucleicAcid',
      value: function drawCartoonNucleicAcid(group, atomlist, div, thickness) {
         this.drawStrandNucleicAcid(group, atomlist, 2, div, true, undefined, thickness);
      }
   }, {
      key: 'drawStrandNucleicAcid',
      value: function drawStrandNucleicAcid(group, atomlist, num, div, fill, nucleicAcidWidth, thickness) {
         nucleicAcidWidth = nucleicAcidWidth || this.nucleicAcidWidth;
         div = div || this.axisDIV;
         num = num || this.nucleicAcidStrandDIV;
         var points = [];for (var k = 0; k < num; k++) {
            points[k] = [];
         }var colors = [];
         var currentChain, currentResi, currentO3;
         var prevOO = null;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if ((atom.atom == 'O3\'' || atom.atom == 'OP2') && !atom.hetflag) {
               if (atom.atom == 'O3\'') {
                  // to connect 3' end. FIXME: better way to
                  // do?
                  if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                     if (currentO3) {
                        for (var j = 0; j < num; j++) {
                           var delta = -1 + 2 / (num - 1) * j;
                           points[j].push(new TV3(currentO3.x + prevOO.x * delta, currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
                        }
                     }
                     if (fill) this.drawStrip(group, points[0], points[1], colors, div, thickness);
                     for (var j = 0; !thickness && j < num; j++) {
                        this.drawSmoothCurve(group, points[j], 1, colors, div);
                     }var points = [];for (var k = 0; k < num; k++) {
                        points[k] = [];
                     }colors = [];
                     prevOO = null;
                  }
                  currentO3 = new TV3(atom.x, atom.y, atom.z);
                  currentChain = atom.chain;
                  currentResi = atom.resi;
                  colors.push(atom.color);
               } else {
                  // OP2
                  if (!currentO3) {
                     prevOO = null;continue;
                  } // for 5' phosphate
                  // (e.g. 3QX3)
                  var O = new TV3(atom.x, atom.y, atom.z);
                  O.subSelf(currentO3);
                  O.normalize().multiplyScalar(nucleicAcidWidth); // TODO:
                  // refactor
                  if (prevOO != undefined && O.dot(prevOO) < 0) {
                     O.negate();
                  }
                  prevOO = O;
                  for (var j = 0; j < num; j++) {
                     var delta = -1 + 2 / (num - 1) * j;
                     points[j].push(new TV3(currentO3.x + prevOO.x * delta, currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
                  }
                  currentO3 = null;
               }
            }
         }
         if (currentO3) {
            for (var j = 0; j < num; j++) {
               var delta = -1 + 2 / (num - 1) * j;
               points[j].push(new TV3(currentO3.x + prevOO.x * delta, currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
            }
         }
         if (fill) this.drawStrip(group, points[0], points[1], colors, div, thickness);
         for (var j = 0; !thickness && j < num; j++) {
            this.drawSmoothCurve(group, points[j], 1, colors, div);
         }
      }
   }, {
      key: 'drawDottedLines',
      value: function drawDottedLines(group, points, color) {
         var geo = new THREE.Geometry();
         var step = 0.3;

         for (var i = 0, lim = Math.floor(points.length / 2); i < lim; i++) {
            var p1 = points[2 * i],
                p2 = points[2 * i + 1];
            var delta = p2.clone().subSelf(p1);
            var dist = delta.length();
            delta.normalize().multiplyScalar(step);
            var jlim = Math.floor(dist / step);
            for (var j = 0; j < jlim; j++) {
               var p = new TV3(p1.x + delta.x * j, p1.y + delta.y * j, p1.z + delta.z * j);
               geo.vertices.push(p);
            }
            if (jlim % 2 == 1) geo.vertices.push(p2);
         }

         var mat = new THREE.LineBasicMaterial({ 'color': color.getHex() });
         mat.linewidth = 2;
         var line = new THREE.Line(geo, mat, THREE.LinePieces);
         group.add(line);
      }
   }, {
      key: 'getAllAtoms',
      value: function getAllAtoms() {
         var ret = [];
         for (var i in this.atoms) {
            ret.push(this.atoms[i].serial);
         }
         return ret;
      }

      // Probably I can refactor using higher-order functions.

   }, {
      key: 'getHetatms',
      value: function getHetatms(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag) ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'removeSolvents',
      value: function removeSolvents(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.resn != 'HOH') ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getProteins',
      value: function getProteins(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (!atom.hetflag) ret.push(atom.serial);
         }
         return ret;
      }

      // TODO: Test

   }, {
      key: 'excludeAtoms',
      value: function excludeAtoms(atomlist, deleteList) {
         var ret = [];
         var blackList = new Object();
         for (var _i in deleteList) {
            blackList[deleteList[_i]] = true;
         }for (var _i in atomlist) {
            var i = atomlist[_i];

            if (!blackList[i]) ret.push(i);
         }
         return ret;
      }
   }, {
      key: 'getSidechains',
      value: function getSidechains(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag) continue;
            if (atom.atom == 'C' || atom.atom == 'O' || atom.atom == 'N' && atom.resn != "PRO") continue;
            ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getAtomsWithin',
      value: function getAtomsWithin(atomlist, extent) {
         var ret = [];

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.x < extent[0][0] || atom.x > extent[1][0]) continue;
            if (atom.y < extent[0][1] || atom.y > extent[1][1]) continue;
            if (atom.z < extent[0][2] || atom.z > extent[1][2]) continue;
            ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getExtent',
      value: function getExtent(atomlist) {
         var xmin = 9999;
         var ymin = 9999;
         var zmin = 9999;

         var xmax = -9999;
         var ymax = -9999;
         var zmax = -9999;

         var xsum = 0;
         var ysum = 0;
         var zsum = 0;
         var cnt = 0;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;
            cnt++;
            xsum += atom.x;ysum += atom.y;zsum += atom.z;

            xmin = xmin < atom.x ? xmin : atom.x;
            ymin = ymin < atom.y ? ymin : atom.y;
            zmin = zmin < atom.z ? zmin : atom.z;
            xmax = xmax > atom.x ? xmax : atom.x;
            ymax = ymax > atom.y ? ymax : atom.y;
            zmax = zmax > atom.z ? zmax : atom.z;
         }
         return [[xmin, ymin, zmin], [xmax, ymax, zmax], [xsum / cnt, ysum / cnt, zsum / cnt]];
      }
   }, {
      key: 'getResiduesById',
      value: function getResiduesById(atomlist, resi) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (resi.indexOf(atom.resi) != -1) ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getResidueBySS',
      value: function getResidueBySS(atomlist, ss) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (ss.indexOf(atom.ss) != -1) ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getChain',
      value: function getChain(atomlist, chain) {
         var ret = [],
             chains = {};
         chain = chain.toString(); // concat if Array
         for (var i = 0, lim = chain.length; i < lim; i++) {
            chains[chain.substr(i, 1)] = true;
         }for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (chains[atom.chain]) ret.push(atom.serial);
         }
         return ret;
      }

      // for HETATM only

   }, {
      key: 'getNonbonded',
      value: function getNonbonded(atomlist, chain) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag && atom.bonds.length == 0) ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'colorByAtom',
      value: function colorByAtom(atomlist, colors) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            var c = colors[atom.elem];
            if (c == undefined) c = this.ElementColors[atom.elem];
            if (c == undefined) c = this.defaultColor;
            atom.color = c;
         }
      }

      // MEMO: Color only CA. maybe I should add atom.cartoonColor.

   }, {
      key: 'colorByStructure',
      value: function colorByStructure(atomlist, helixColor, sheetColor, colorSidechains) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (!colorSidechains && (atom.atom != 'CA' || atom.hetflag)) continue;
            if (atom.ss[0] == 's') atom.color = sheetColor;else if (atom.ss[0] == 'h') atom.color = helixColor;
         }
      }
   }, {
      key: 'colorByBFactor',
      value: function colorByBFactor(atomlist, colorSidechains) {
         var minB = 1000,
             maxB = -1000;

         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag) continue;
            if (colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'') {
               if (minB > atom.b) minB = atom.b;
               if (maxB < atom.b) maxB = atom.b;
            }
         }

         var mid = (maxB + minB) / 2;

         var range = (maxB - minB) / 2;
         if (range < 0.01 && range > -0.01) return;
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag) continue;
            if (colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'') {
               var color = new TCo(0);
               if (atom.b < mid) color.setHSV(0.667, (mid - atom.b) / range, 1);else color.setHSV(0, (atom.b - mid) / range, 1);
               atom.color = color.getHex();
            }
         }
      }
   }, {
      key: 'colorByChain',
      value: function colorByChain(atomlist, colorSidechains) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if (atom.hetflag) continue;
            if (colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'') {
               var color = new TCo(0);
               color.setHSV(atom.chain.charCodeAt(0) * 5 % 17 / 17.0, 1, 0.9);
               atom.color = color.getHex();
            }
         }
      }
   }, {
      key: 'colorByResidue',
      value: function colorByResidue(atomlist, residueColors) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            c = residueColors[atom.resn];
            if (c != undefined) atom.color = c;
         }
      }
   }, {
      key: 'colorAtoms',
      value: function colorAtoms(atomlist, c) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            atom.color = c;
         }
      }
   }, {
      key: 'colorByPolarity',
      value: function colorByPolarity(atomlist, polar, nonpolar) {
         var polarResidues = ['ARG', 'HIS', 'LYS', 'ASP', 'GLU', 'SER', 'THR', 'ASN', 'GLN', 'CYS'];
         var nonPolarResidues = ['GLY', 'PRO', 'ALA', 'VAL', 'LEU', 'ILE', 'MET', 'PHE', 'TYR', 'TRP'];
         var colorMap = {};
         for (var i in polarResidues) {
            colorMap[polarResidues[i]] = polar;
         }for (i in nonPolarResidues) {
            colorMap[nonPolarResidues[i]] = nonpolar;
         }this.colorByResidue(atomlist, colorMap);
      }

      // TODO: Add near(atomlist, neighbor, distanceCutoff)
      // TODO: Add expandToResidue(atomlist)

   }, {
      key: 'colorChainbow',
      value: function colorChainbow(atomlist, colorSidechains) {
         var cnt = 0;
         var atom, i;
         for (i in atomlist) {
            atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if ((colorSidechains || atom.atom != 'CA' || atom.atom != 'O3\'') && !atom.hetflag) cnt++;
         }

         var total = cnt;
         cnt = 0;
         for (i in atomlist) {
            atom = this.atoms[atomlist[i]];if (atom == undefined) continue;

            if ((colorSidechains || atom.atom != 'CA' || atom.atom != 'O3\'') && !atom.hetflag) {
               var color = new TCo(0);
               color.setHSV(240.0 / 360 * (1 - cnt / total), 1, 0.9);
               atom.color = color.getHex();
               cnt++;
            }
         }
      }
   }, {
      key: 'drawSymmetryMates2',
      value: function drawSymmetryMates2(group, asu, matrices) {
         if (matrices == undefined) return;
         asu.matrixAutoUpdate = false;

         var cnt = 1;
         this.protein.appliedMatrix = new THREE.Matrix4();
         for (var i = 0; i < matrices.length; i++) {
            var mat = matrices[i];
            if (mat == undefined || mat.isIdentity()) continue;
            console.log(mat);
            var symmetryMate = THREE.SceneUtils.cloneObject(asu);
            symmetryMate.matrix = mat;
            group.add(symmetryMate);
            for (var j = 0; j < 16; j++) {
               this.protein.appliedMatrix.elements[j] += mat.elements[j];
            }cnt++;
         }
         this.protein.appliedMatrix.multiplyScalar(cnt);
      }
   }, {
      key: 'drawSymmetryMatesWithTranslation2',
      value: function drawSymmetryMatesWithTranslation2(group, asu, matrices) {
         if (matrices == undefined) return;
         var p = this.protein;
         asu.matrixAutoUpdate = false;

         for (var i = 0; i < matrices.length; i++) {
            var mat = matrices[i];
            if (mat == undefined) continue;

            for (var a = -1; a <= 0; a++) {
               for (var b = -1; b <= 0; b++) {
                  for (var c = -1; c <= 0; c++) {
                     var translationMat = new THREE.Matrix4().makeTranslation(p.ax * a + p.bx * b + p.cx * c, p.ay * a + p.by * b + p.cy * c, p.az * a + p.bz * b + p.cz * c);
                     var symop = mat.clone().multiplySelf(translationMat);
                     if (symop.isIdentity()) continue;
                     var symmetryMate = THREE.SceneUtils.cloneObject(asu);
                     symmetryMate.matrix = symop;
                     group.add(symmetryMate);
                  }
               }
            }
         }
      }
   }, {
      key: 'createTextTex',
      value: function createTextTex(text, size, color) {

         var canvas = document.createElement("canvas");
         canvas.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
         var ctx = canvas.getContext("2d");
         ctx.font = size + "px Arial";
         canvas.width = ctx.measureText(text).width;
         canvas.height = size; // This resets fonts, so we have to set it again
         ctx.fillStyle = color ? color : "rgba(0, 0, 0, 1.0)";
         ctx.strokeStyle = ctx.fillStyle;
         ctx.font = size + "px Arial";
         ctx.fillText(text, 0, size * 0.9);
         // document.getElementById("glmol01").appendChild(canvas);
         var tex = new THREE.Texture(canvas);
         tex.needsUpdate = true;
         tex.magFilter = tex.minFilter = THREE.LinearFilter;
         return tex;
      }
   }, {
      key: 'getBillboardMesh',
      value: function getBillboardMesh() {
         if (this.bbmesh) return this.bbmesh;

         var geo = new THREE.Geometry();
         for (var i = 0; i < 6; i++) {
            geo.vertices.push(new THREE.Vector3(0, 0, 0));
         }geo.faces.push(new THREE.Face3(0, 1, 2));
         geo.faces.push(new THREE.Face3(0, 2, 3));
         geo.faceVertexUvs[0].push([new THREE.UV(0, 0), new THREE.UV(1, 1), new THREE.UV(0, 1)]);
         geo.faceVertexUvs[0].push([new THREE.UV(0, 0), new THREE.UV(1, 0), new THREE.UV(1, 1)]);
         return this.bbmesh = geo;
      }
   }, {
      key: 'billboard',
      value: function billboard(tex) {
         var geo = this.getBillboardMesh();
         var sm = new THREE.ShaderMaterial({ uniforms: { map: { type: 't', value: 0, texture: tex },
               width: { type: 'f', value: tex.image.width }, height: { type: 'f', value: tex.image.height } } });
         sm.vertexShader = vs_billboard;
         sm.fragmentShader = fs_billboard;
         return new THREE.Mesh(geo, sm);
      }
   }, {
      key: 'defineRepresentation',
      value: function defineRepresentation() {
         var all = this.getAllAtoms();
         var hetatm = this.removeSolvents(this.getHetatms(all));
         this.colorByAtom(all, {});
         this.colorByChain(all);

         this.drawAtomsAsSphere(this.modelGroup, hetatm, this.sphereRadius);
         this.drawMainchainCurve(this.modelGroup, all, this.curveWidth, 'P');
         this.drawCartoon(this.modelGroup, all, this.curveWidth);
      }
   }, {
      key: 'getView',
      value: function getView() {
         if (!this.modelGroup) return [0, 0, 0, 0, 0, 0, 0, 1];
         var pos = this.modelGroup.position;
         var q = this.rotationGroup.quaternion;
         return [pos.x, pos.y, pos.z, this.rotationGroup.position.z, q.x, q.y, q.z, q.w];
      }
   }, {
      key: 'setView',
      value: function setView(arg) {
         if (!this.modelGroup || !this.rotationGroup) return;
         this.modelGroup.position.x = arg[0];
         this.modelGroup.position.y = arg[1];
         this.modelGroup.position.z = arg[2];
         this.rotationGroup.position.z = arg[3];
         this.rotationGroup.quaternion.x = arg[4];
         this.rotationGroup.quaternion.y = arg[5];
         this.rotationGroup.quaternion.z = arg[6];
         this.rotationGroup.quaternion.w = arg[7];
         this.show();
      }
   }, {
      key: 'setBackground',
      value: function setBackground(hex, a) {
         a = a | 1.0;
         this.bgColor = hex;
         this.renderer.setClearColorHex(hex, a);
         this.scene.fog.color = new TCo(hex);
      }
   }, {
      key: 'initializeScene',
      value: function initializeScene() {
         // CHECK: Should I explicitly call scene.deallocateObject?
         this.scene = new THREE.Scene();
         this.scene.fog = new THREE.Fog(this.bgColor, 100, 200);

         this.modelGroup = new THREE.Object3D();
         this.rotationGroup = new THREE.Object3D();
         this.rotationGroup.useQuaternion = true;
         this.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);

         this.rotationGroup.add(this.modelGroup);

         this.scene.add(this.rotationGroup);
         this.setupLights(this.scene);
      }
   }, {
      key: 'zoomInto',
      value: function zoomInto(atomlist, keepSlab) {
         var tmp = this.getExtent(atomlist);
         var center = new TV3(tmp[2][0], tmp[2][1], tmp[2][2]);
         if (this.protein.appliedMatrix) {
            center = this.protein.appliedMatrix.multiplyVector3(center);
         }
         this.modelGroup.position = center.multiplyScalar(-1);

         var x = tmp[1][0] - tmp[0][0],
             y = tmp[1][1] - tmp[0][1],
             z = tmp[1][2] - tmp[0][2];

         var maxD = Math.sqrt(x * x + y * y + z * z);
         if (maxD < 25) maxD = 25;

         if (!keepSlab) {
            this.slabNear = -maxD / 1.9;
            this.slabFar = maxD / 3;
         }

         this.rotationGroup.position.z = maxD * 0.35 / Math.tan(Math.PI / 180.0 * this.camera.fov / 2) - 150;
         this.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);
      }
   }, {
      key: 'rebuildScene',
      value: function rebuildScene() {
         var time = new Date();

         var view = this.getView();
         this.initializeScene();
         this.defineRepresentation();
         this.setView(view);

         console.log("builded scene in " + (+new Date() - time) + "ms");
      }
   }, {
      key: 'loadMolecule',
      value: function loadMolecule(repressZoom) {
         this.loadMoleculeStr(repressZoom, $('#' + this.id + '_src').val());
      }
   }, {
      key: 'loadMoleculeStr',
      value: function loadMoleculeStr(repressZoom, source) {
         var time = new Date();

         this.protein = { sheet: [], helix: [], biomtChains: '', biomtMatrices: [], symMat: [], pdbID: '', title: '' };
         this.atoms = [];

         this.parsePDB2(source);
         if (!this.parseSDF(source)) this.parseXYZ(source);
         console.log("parsed in " + (+new Date() - time) + "ms");

         var title = $('#' + this.id + '_pdbTitle');
         var titleStr = '';
         if (this.protein.pdbID != '') titleStr += '<a href="http://www.rcsb.org/pdb/explore/explore.do?structureId=' + this.protein.pdbID + '">' + this.protein.pdbID + '</a>';
         if (this.protein.title != '') titleStr += '<br>' + this.protein.title;
         title.html(titleStr);

         this.rebuildScene(true);
         if (repressZoom == undefined || !repressZoom) this.zoomInto(this.getAllAtoms());

         this.show();
      }
   }, {
      key: 'setSlabAndFog',
      value: function setSlabAndFog() {
         var center = this.rotationGroup.position.z - this.camera.position.z;
         if (center < 1) center = 1;
         this.camera.near = center + this.slabNear;
         if (this.camera.near < 1) this.camera.near = 1;
         this.camera.far = center + this.slabFar;
         if (this.camera.near + 1 > this.camera.far) this.camera.far = this.camera.near + 1;
         if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.fov = this.fov;
         } else {
            this.camera.right = center * Math.tan(Math.PI / 180 * this.fov);
            this.camera.left = -this.camera.right;
            this.camera.top = this.camera.right / this.ASPECT;
            this.camera.bottom = -this.camera.top;
         }
         this.camera.updateProjectionMatrix();
         this.scene.fog.near = this.camera.near + this.fogStart * (this.camera.far - this.camera.near);
         // if (this.scene.fog.near > center) this.scene.fog.near = center;
         this.scene.fog.far = this.camera.far;
      }
   }, {
      key: 'adjustPos',
      value: function adjustPos(ev) {
         var x = ev.pageX,
             y = ev.pageY;
         if (ev.originalEvent.targetTouches && ev.originalEvent.targetTouches[0]) {
            x = ev.originalEvent.targetTouches[0].pageX;
            y = ev.originalEvent.targetTouches[0].pageY;
         }
         ev.x = x;ev.y = y;
      }
   }, {
      key: 'toScreenPosition',
      value: function toScreenPosition(obj, camera, width, height) {
         var vector = new THREE.Vector3();

         var widthHalf = 0.5 * width;
         var heightHalf = 0.5 * height;

         // obj.updateMatrixWorld();
         // vector.setFromMatrixPosition(obj.matrixWorld);
         pepe = vector.projectVector(vector, camera);
         vector = pepe;

         vector.x = vector.x * widthHalf + widthHalf;
         vector.y = -(vector.y * heightHalf) + heightHalf;

         return {
            x: vector.x,
            y: vector.y
         };
      }
   }, {
      key: 'enableMouse',
      value: function enableMouse() {
         var me = this,
             glDOM = $(this.renderer.domElement);

         // TODO: Better touch panel support.
         // Contribution is needed as I don't own any iOS or Android device with
         // WebGL support.
         glDOM.bind('mousedown touchstart', function (ev) {
            ev.preventDefault();
            if (!me.scene) return;
            me.adjustPos(ev);
            if (ev.x == undefined) return;
            me.isDragging = true;
            me.mouseButton = ev.which;
            me.mouseStartX = ev.x;
            me.mouseStartY = ev.y;
            me.cq = me.rotationGroup.quaternion;
            me.cz = me.rotationGroup.position.z;
            me.currentModelPos = me.modelGroup.position.clone();
            me.cslabNear = me.slabNear;
            me.cslabFar = me.slabFar;
         });

         glDOM.bind('DOMMouseScroll mousewheel', function (ev) {
            // Zoom
            ev.preventDefault();
            if (!me.scene) return;
            var scaleFactor = (me.rotationGroup.position.z - me.CAMERA_Z) * 0.85;
            if (ev.originalEvent.detail) {
               // Webkit
               me.rotationGroup.position.z += scaleFactor * ev.originalEvent.detail / 10;
            } else if (ev.originalEvent.wheelDelta) {
               // Firefox
               me.rotationGroup.position.z -= scaleFactor * ev.originalEvent.wheelDelta / 400;
            }
            console.log(ev.originalEvent.wheelDelta, ev.originalEvent.detail, me.rotationGroup.position.z);
            me.show();
         });
         glDOM.bind("contextmenu", function (ev) {
            ev.preventDefault();
         });

         $('#body').bind('mouseup touchend', function (ev) {
            me.isDragging = false;

            me.adjustPos(ev);var x = ev.x,
                y = ev.y;
            if (x == undefined) return;
            var dx = x - me.mouseStartX,
                dy = y - me.mouseStartY;
            var r = Math.sqrt(dx * dx + dy * dy);
            if (r > 2) return;
            x -= me.container.position().left;y -= me.container.position().top;

            var mvMat = new THREE.Matrix4().multmultiplySelf(amera.matrixWorldInverse, me.modelGroup.matrixWorld);
            var pmvMat = new THREE.Matrix4().multiply(me.camera.projectionMatrix, mvMat);
            var pmvMatInv = new THREE.Matrix4().getInverse(pmvMat);
            var tx = x / me.WIDTH * 2 - 1,
                ty = 1 - y / me.HEIGHT * 2;
            var nearest = [1, undefined, new TV3(0, 0, 1000)];

            /*
            * 
            * var vector = new THREE.Vector3();
            * 
            * vector.set( (x / me.container.width() ) * 2 - 1, - ( y
            * /me.container.height() ) * 2 + 1, 0.5 );
            * 
            * //vector.unproject( me.camera );
            * 
            * var matrix = new THREE.Matrix4();
            * 
            * matrix = matrix.multiply( me.camera.matrixWorld,
            * matrix.getInverse( me.camera.projectionMatrix ) );
            * 
            * function applyProjection (vector, m ) { // input: THREE.Matrix4
            * projection matrix
            * 
            * var x = vector.x, y = vector.y, z = vector.z;
            * 
            * var e = m.elements; var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] *
            * z + e[ 15 ] ); // perspective divide
            * 
            * vector.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) *
            * d; vector.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) *
            * d; vector.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) *
            * d;
            * 
            *  }
            * 
            * //return this.applyProjection( matrix );
            * applyProjection(vector,matrix)
            * 
            * 
            * 
            * var dir = vector.sub( vector,me.camera.position ).normalize();
            * 
            * var distance = - me.camera.position.z / dir.z;
            * 
            * var pos =
            * me.camera.position.clone().add(me.camera.position.clone(),
            * dir.multiplyScalar( distance ) ); tx = pos.x ty = pos.y
            * 
            */

            for (var i = 0, ilim = me.atoms.length; i < ilim; i++) {
               var applyProjection = function applyProjection(vector, m) {

                  // input: THREE.Matrix4 projection matrix

                  var x = vector.x,
                      y = vector.y,
                      z = vector.z;

                  var e = m.elements;
                  var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective
                  // divide

                  vector.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
                  vector.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
                  vector.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
               };

               var atom = me.atoms[i];if (atom == undefined) continue;
               if (atom.x == undefined) continue;
               if (atom.resn == "HOH") continue;

               // if(atom.resn == "CYS"){
               // var bb = me.billboard(me.createTextTex(atom.chain + ":" + atom.resn + ":" +
               // atom.resi + ":" + atom.atom, "30", "#ffffff"));
               // bb.position.set(atom.x, atom.y, atom.z);
               // me.modelGroup.add(bb);
               // }
               // juaja = toScreenPosition(atom,me.camera,me.WIDTH,me.HEIGHT)


               // ----------------------------------------------------------

               var matrix = new THREE.Matrix4();

               var p = new THREE.Vector3(atom.x, atom.y, atom.z);

               juan = matrix.multiply(me.camera.matrixWorld, matrix.getInverse(me.camera.projectionMatrix));
               matrix = juan;


               applyProjection(p, matrix);
               p.x = Math.round((p.x + 1) * me.WIDTH / 2), p.y = Math.round((-p.y + 1) * me.HEIGHT / 2);
               p.z = 0;

               // ------------------------------------------------------------


               var v = new TV3(atom.x, atom.y, atom.z);
               pmvMat.multiplyVector3(v);
               var r2 = (v.x - tx) * (v.x - tx) + (v.y - ty) * (v.y - ty);
               if (r2 > 0.0005) continue;
               if (v.z < nearest[2].z) nearest = [r2, atom, v];
               if (r2 > 0.0002) continue;
               if (r2 < nearest[0]) nearest = [r2, atom, v];
            }
            var atom = nearest[1];if (atom == undefined) return;
            var bb = me.billboard(me.createTextTex(atom.chain + ":" + atom.resn + ":" + atom.resi + ":" + atom.atom, "30", "#ffffff"));
            bb.position.set(atom.x, atom.y, atom.z);
            me.modelGroup.add(bb);
            me.show();
         });

         glDOM.bind('mousemove touchmove', function (ev) {
            // touchmove

            ev.preventDefault();
            if (!me.scene) return;
            if (!me.isDragging) return;
            var mode = 0;
            var modeRadio = $('input[name=' + me.id + '_mouseMode]:checked');
            if (modeRadio.length > 0) mode = parseInt(modeRadio.val());

            me.adjustPos(ev);var x = ev.x,
                y = ev.y;
            if (x == undefined) return;
            var dx = (x - me.mouseStartX) / me.WIDTH;
            var dy = (y - me.mouseStartY) / me.HEIGHT;
            var r = Math.sqrt(dx * dx + dy * dy);
            if (mode == 3 || me.mouseButton == 3 && ev.ctrlKey) {
               // Slab
               me.slabNear = me.cslabNear + dx * 100;
               me.slabFar = me.cslabFar + dy * 100;
            } else if (mode == 2 || me.mouseButton == 3 || ev.shiftKey) {
               // Zoom
               var scaleFactor = (me.rotationGroup.position.z - me.CAMERA_Z) * 0.85;
               if (scaleFactor < 80) scaleFactor = 80;
               me.rotationGroup.position.z = me.cz - dy * scaleFactor;
            } else if (mode == 1 || me.mouseButton == 2 || ev.ctrlKey) {
               // Translate
               var scaleFactor = (me.rotationGroup.position.z - me.CAMERA_Z) * 0.85;
               if (scaleFactor < 20) scaleFactor = 20;
               var translationByScreen = new TV3(-dx * scaleFactor, -dy * scaleFactor, 0);
               var q = me.rotationGroup.quaternion;
               var qinv = new THREE.Quaternion(q.x, q.y, q.z, q.w).inverse().normalize();
               var translation = qinv.multiplyVector3(translationByScreen);
               me.modelGroup.position.x = me.currentModelPos.x + translation.x;
               me.modelGroup.position.y = me.currentModelPos.y + translation.y;
               me.modelGroup.position.z = me.currentModelPos.z + translation.z;
            } else if ((mode == 0 || me.mouseButton == 1) && r != 0) {
               // Rotate
               var rs = Math.sin(r * Math.PI) / r;
               me.dq.x = Math.cos(r * Math.PI);
               me.dq.y = 0;
               me.dq.z = rs * dx;
               me.dq.w = rs * dy;
               me.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);

               me.rotationGroup.quaternion.multiplySelf(me.dq);
               me.rotationGroup.quaternion.multiplySelf(me.cq);
            }
            me.show();
         });
      }
   }, {
      key: 'show',
      value: function show() {
         if (!this.scene) return;

         var time = new Date();
         this.setSlabAndFog();
         this.renderer.render(this.scene, this.camera);
         console.log("rendered in " + (+new Date() - time) + "ms");
      }

      // For scripting

   }, {
      key: 'doFunc',
      value: function doFunc(func) {
         func(this);
      }
   }, {
      key: 'getAtomsByName',
      value: function getAtomsByName(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            atom = atomlist[i].split(".");
            chain = atom[0];
            resi = atom[1];
            atom = atom[2];

            for (var j in this.atoms) {
               if (this.atoms[j].chain == chain && this.atoms[j].resi == resi && this.atoms[j].atom == atom) {
                  ret.push(this.atoms[j].serial);
               }
            }
         }
         return ret;
      }
   }, {
      key: 'residue_atoms',
      value: function residue_atoms(res_ids) {

         if ($.isArray(res_ids)) {
            return $.grep(this.atoms, function (x) {
               if (typeof x != "undefined") {

                  return res_ids.indexOf(x.chain + "." + x.resi) != -1;
               }
            });
         } else {
            return $.grep(this.atoms, function (x) {
               if (typeof x != "undefined") {

                  return [x.chain, x.resi].join(".") == res_ids;
               }
            });
         }
      }
   }, {
      key: 'select_residues',
      value: function select_residues(res_ids) {

         this.selected_atoms = $.map(this.residue_atoms(res_ids), function (x) {
            return x.serial;
         });
         if (this.selected_atoms.length > 0) {
            //this.zoomInto( this.selected_atoms )
            this.refreshAll();
         }
      }
   }, {
      key: 'chain_atoms',
      value: function chain_atoms(chain) {
         var atmIndexes = [];
         $.each(this.atoms, function (i, atm) {
            if (typeof atm != "undefined" && atm.chain == chain && atm.resn != "STP") {
               atmIndexes.push(i);
            }
         });
         return this.removeSolvents(atmIndexes);
      }
   }, {
      key: 'defineRepresentation',
      value: function defineRepresentation() {
         this._render_selected();
         $.each(this.layers, function (i, layer) {
            layer.render();
         }.bind(this));
      }
   }, {
      key: '_render_selected',
      value: function _render_selected() {

         if (this.selected_atoms && this.selected_atoms.length > 0) {

            var atomsIndex = this.selected_atoms;
            this.selected_atoms_renderer.render(this, this.getHetatms(atomsIndex));
            this.selected_atoms_bond_renderer.render(this, this.removeSolvents(atomsIndex));
         }
      }
   }, {
      key: 'add_to_selected',
      value: function add_to_selected(atom_serial) {
         if ($.isArray(atom_serial)) {
            $.each(atom_serial, function (i, x) {
               this.selected_atoms.push(x);
            }.bind(this));
         } else {
            this.selected_atoms.push(atom_serial);
         }
         this.refreshAll();
      }
   }, {
      key: 'remove_from_selected',
      value: function remove_from_selected(atom_serial) {
         if ($.isArray(atom_serial)) {
            this.selected_atoms = $.grep(this.selected_atoms, function (x) {
               return atom_serial.indexOf(x) == -1;
            });
         } else {
            this.selected_atoms = $.grep(this.selected_atoms, function (x) {
               return x != atom_serial;
            });
         }
         this.refreshAll();
      }
   }, {
      key: 'clear_selection',
      value: function clear_selection() {
         this.selected_atoms = [];
         this.refreshAll();
      }
   }, {
      key: 'select_by_atom_name',
      value: function select_by_atom_name(atom_name_list) {
         this.selected_atoms = this.getAtomsByName(atom_name_list);
         this.refreshAll();
      }
   }, {
      key: 'load_data',
      value: function load_data(data) {
         this.data = data;
         this.loadMoleculeStr(undefined, this.data);

         this.chains = $.unique($.map(this.atoms, function (atm, i) {
            if (typeof atm != "undefined" && atm.resn != "STP") return atm.chain;
         }));
         this.chains = $.unique(this.chains.sort());
         //this.data_loaded()
         this.refreshAll();
      }
   }, {
      key: 'refreshAll',
      value: function refreshAll() {
         this.rebuildScene();
         this.show();
      }
   }, {
      key: 'add_layer',
      value: function add_layer(layer) {
         this.layers.push(layer);
         layer.glmol = this;
      }
   }, {
      key: 'add_pdb_str',
      value: function add_pdb_str(pdb_str) {

         var arr = this.data.split("\n");
         var end = arr.length - 3;
         var foo = [];
         for (var i = 0; i <= end; i++) {
            foo.push(arr[i]);
         }

         this.data = foo.join('\n') + pdb_str; // .join("\n")

         this.loadMoleculeStr(undefined, this.data);
         this.refreshAll();
      }
      /**
       * Agrego los métodos que necesito al prototipo de GLmol
       */

   }, {
      key: 'removeAlphaSpheres',
      value: function removeAlphaSpheres(atomlist) {
         var ret = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if (atom.resn != 'STP') ret.push(atom.serial);
         }
         return ret;
      }
   }, {
      key: 'getAlphaSpheres',
      value: function getAlphaSpheres(atomlist) {

         var ret = [];
         var alpha_pol = [];
         var alpha_apol = [];
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            if (atom.resn == 'STP') {
               if (atom.atom == 'POL') {
                  alpha_pol.push(atom.serial);
               } else if (atom.atom == 'APOL') {
                  alpha_apol.push(atom.serial);
               }
            }
         }
         return new Array(alpha_pol, alpha_apol);
      }
   }, {
      key: 'chain_layers',
      value: function chain_layers() {

         return $.grep(this.layers, function (l) {
            return !(l instanceof _Pocket.Pocket);
         });
      }
   }, {
      key: 'pocket_layers',
      value: function pocket_layers() {

         return $.grep(this.layers, function (l) {
            return l instanceof _Pocket.Pocket;
         });
      }
   }, {
      key: 'colorByAtomName',
      value: function colorByAtomName(atomlist, residueColors) {
         for (var i in atomlist) {
            var atom = this.atoms[atomlist[i]];
            if (atom == undefined) continue;

            c = residueColors[atom.atom];
            if (c != undefined) atom.color = c;
         }
      }
   }, {
      key: 'draw_labels',
      value: function draw_labels(atoms_id) {
         var me = this;
         this._draw_labels($.map(atoms_id, function (atom_id) {
            return me.atoms[atom_id];
         }));
      }
   }, {
      key: '_draw_labels',
      value: function _draw_labels(atoms) {
         var me = this;
         $.each(atoms, function (i, atom) {
            var bb = me.billboard(me.createTextTex(me.atom_label_id(atom), "60", "#ffffff"));
            bb.position.set(atom.x, atom.y, atom.z);
            me.atom_labels[me.atom_label_id(atom)] = bb;
            me.modelGroup.add(bb);
         }.bind(this));
      }
   }, {
      key: 'atom_label_id',
      value: function atom_label_id(atom) {
         //atom.chain + ":" + ... + + ":" + atom.atom;
         return atom.resn + ":" + atom.resi;
      }
   }, {
      key: '_init_click_event',
      value: function _init_click_event() {
         var me = this;
         $(this.container).bind('mouseup touchend', function (ev) {
            me.isDragging = false;

            me.adjustPos(ev);
            var x = ev.x,
                y = ev.y;
            if (x == undefined) return;
            var dx = x - me.mouseStartX,
                dy = y - me.mouseStartY;
            var r = Math.sqrt(dx * dx + dy * dy);
            if (r > 2) return;
            x -= me.container.position().left;
            y -= me.container.position().top;

            x = ev.offsetX;
            y = ev.offsetY;

            var mvMat = new THREE.Matrix4().multiply(me.camera.matrixWorldInverse, me.modelGroup.matrixWorld);
            var pmvMat = new THREE.Matrix4().multiply(me.camera.projectionMatrix, mvMat);
            var pmvMatInv = new THREE.Matrix4().getInverse(pmvMat);
            var tx = x / me.WIDTH * 2 - 1,
                ty = 1 - y / me.HEIGHT * 2;
            var nearest = [1, undefined, new TV3(0, 0, 1000)];

            for (var i = 0, ilim = me.atoms.length; i < ilim; i++) {
               var atom = me.atoms[i];
               if (atom == undefined) continue;
               if (atom.x == undefined) continue;
               if (atom.resn == "HOH") continue;

               var v = new TV3(atom.x, atom.y, atom.z);
               pmvMat.multiplyVector3(v);
               var r2 = (v.x - tx) * (v.x - tx) + (v.y - ty) * (v.y - ty);
               if (r2 > 0.001) continue;
               if (v.z < nearest[2].z) nearest = [r2, atom, v];
               if (r2 > 0.001) continue;
               if (r2 < nearest[0]) nearest = [r2, atom, v];
            }
            var atom = nearest[1];
            if (atom == undefined) return;

            if (me.atom_labels[me.atom_label_id(atom)] == undefined) {
               me._draw_labels([atom]);
            } else {
               me.modelGroup.remove(me.atom_labels[me.atom_label_id(atom)]);
               delete me.atom_labels[me.atom_label_id(atom)];
            }

            me.show();
         });
      }
   }]);

   return GLmol;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pocket = function () {
	function Pocket(name, atoms, alpha_spheres, style) {
		_classCallCheck(this, Pocket);

		this.name = name;
		this.atoms = atoms;
		this.alpha_spheres = alpha_spheres;
		this.visible = false;

		this.style = new $.PocketStyle(style);
	}

	_createClass(Pocket, [{
		key: "refresh",
		value: function refresh() {
			this.glmol.refreshAll();
		}
	}, {
		key: "render",
		value: function render() {
			if (this.visible) {
				var atoms = [];

				if (this.style.show_alpha_spheres) {
					atoms = this.alpha_spheres;
				} else {
					atoms = this.atoms;
				}
				this.style.render(this.glmol, atoms);
			}
		}
	}, {
		key: "center_view",
		value: function center_view() {
			this.glmol.zoomInto(this.atoms);
			this.glmol.refreshAll();
		}
	}]);

	return Pocket;
}();

exports.default = Pocket;
module.exports = exports["default"];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SBGGLMol = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLmol2 = __webpack_require__(3);

var _StickStyle = __webpack_require__(0);

var _SphereStyle = __webpack_require__(1);

var _Pocket = __webpack_require__(4);

var _AtomColorer = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SBGGLMol = exports.SBGGLMol = function (_GLmol) {
    _inherits(SBGGLMol, _GLmol);

    function SBGGLMol(id, supress) {
        _classCallCheck(this, SBGGLMol);

        return _possibleConstructorReturn(this, (SBGGLMol.__proto__ || Object.getPrototypeOf(SBGGLMol)).call(this, id, supress)); /*
                                                                                                                                  this.selected_atoms_color = parseInt( "0x9F00FF" )
                                                                                                                                  this.selected_atoms = [];    
                                                                                                                                  this.layers = []
                                                                                                                                  this.selected_atoms = []
                                                                                                                                  this.atom_labels = []
                                                                                                                                  this.selected_atoms_bond_renderer = new StickStyle(
                                                                                                                                  new AtomColorer( this.selected_atoms_color ) );
                                                                                                                                  this.selected_atoms_renderer = new SphereStyle( new AtomColorer(
                                                                                                                                  this.selected_atoms_color ), 0.1 );
                                                                                                                                  */
    }

    _createClass(SBGGLMol, [{
        key: 'getAtomsByName',
        value: function getAtomsByName(atomlist) {
            var ret = [];
            for (var i in atomlist) {
                atom = atomlist[i].split(".");
                chain = atom[0];
                resi = atom[1];
                atom = atom[2];

                for (var j in this.atoms) {
                    if (this.atoms[j].chain == chain && this.atoms[j].resi == resi && this.atoms[j].atom == atom) {
                        ret.push(this.atoms[j].serial);
                    }
                }
            }
            return ret;
        }
    }, {
        key: 'residue_atoms',
        value: function residue_atoms(res_ids) {

            if ($.isArray(res_ids)) {
                return $.grep(this.atoms, function (x) {
                    if (typeof x != "undefined") {

                        return res_ids.indexOf(x.chain + "." + x.resi) != -1;
                    }
                });
            } else {
                return $.grep(this.atoms, function (x) {
                    if (typeof x != "undefined") {

                        return [x.chain, x.resi].join(".") == res_ids;
                    }
                });
            }
        }
    }, {
        key: 'select_residues',
        value: function select_residues(res_ids) {

            this.selected_atoms = $.map(this.residue_atoms(res_ids), function (x) {
                return x.serial;
            });
            if (this.selected_atoms.length > 0) {
                this.zoomInto(this.selected_atoms);
                this.refreshAll();
            }
        }
    }, {
        key: 'chain_atoms',
        value: function chain_atoms(chain) {
            var atmIndexes = [];
            $.each(this.atoms, function (i, atm) {
                if (typeof atm != "undefined" && atm.chain == chain && atm.resn != "STP") {
                    atmIndexes.push(i);
                }
            });
            return this.removeSolvents(atmIndexes);
        }
    }, {
        key: 'defineRepresentation',
        value: function defineRepresentation() {
            this._render_selected();
            $.each(this.layers, function (i, layer) {
                layer.render();
            }.bind(this));
        }
    }, {
        key: '_render_selected',
        value: function _render_selected() {

            if (this.selected_atoms && this.selected_atoms.length > 0) {

                var atomsIndex = this.selected_atoms;
                this.selected_atoms_renderer.render(this, this.getHetatms(atomsIndex));
                this.selected_atoms_bond_renderer.render(this, this.removeSolvents(atomsIndex));
            }
        }
    }, {
        key: 'add_to_selected',
        value: function add_to_selected(atom_serial) {
            if ($.isArray(atom_serial)) {
                $.each(atom_serial, function (i, x) {
                    this.selected_atoms.push(x);
                }.bind(this));
            } else {
                this.selected_atoms.push(atom_serial);
            }
            this.refreshAll();
        }
    }, {
        key: 'remove_from_selected',
        value: function remove_from_selected(atom_serial) {
            if ($.isArray(atom_serial)) {
                this.selected_atoms = $.grep(this.selected_atoms, function (x) {
                    return atom_serial.indexOf(x) == -1;
                });
            } else {
                this.selected_atoms = $.grep(this.selected_atoms, function (x) {
                    return x != atom_serial;
                });
            }
            this.refreshAll();
        }
    }, {
        key: 'clear_selection',
        value: function clear_selection() {
            this.selected_atoms = [];
            this.refreshAll();
        }
    }, {
        key: 'select_by_atom_name',
        value: function select_by_atom_name(atom_name_list) {
            this.selected_atoms = this.getAtomsByName(atom_name_list);
            this.refreshAll();
        }
    }, {
        key: 'load_data',
        value: function load_data(data) {
            this.data = data;
            this.loadMoleculeStr(undefined, this.data);

            this.chains = $.unique($.map(this.atoms, function (atm, i) {
                if (typeof atm != "undefined" && atm.resn != "STP") return atm.chain;
            }));
            this.chains = $.unique(this.chains.sort());
            this.data_loaded();
            this.refreshAll();
        }
    }, {
        key: 'refreshAll',
        value: function refreshAll() {
            this.rebuildScene();
            this.show();
        }
    }, {
        key: 'add_layer',
        value: function add_layer(layer) {
            this.layers.push(layer);
            layer.glmol = this;
        }
    }, {
        key: 'add_pdb_str',
        value: function add_pdb_str(pdb_str) {

            var arr = this.data.split("\n");
            var end = arr.length - 3;
            var foo = [];
            for (var i = 0; i <= end; i++) {
                foo.push(arr[i]);
            }

            this.data = foo.join('\n') + pdb_str; // .join("\n")

            this.loadMoleculeStr(undefined, this.data);
            this.refreshAll();
        }
        /**
         * Agrego los métodos que necesito al prototipo de GLmol
         */

    }, {
        key: 'removeAlphaSpheres',
        value: function removeAlphaSpheres(atomlist) {
            var ret = [];
            for (var i in atomlist) {
                var atom = this.atoms[atomlist[i]];
                if (atom == undefined) continue;

                if (atom.resn != 'STP') ret.push(atom.serial);
            }
            return ret;
        }
    }, {
        key: 'getAlphaSpheres',
        value: function getAlphaSpheres(atomlist) {

            var ret = [];
            var alpha_pol = [];
            var alpha_apol = [];
            for (var i in atomlist) {
                var atom = this.atoms[atomlist[i]];
                if (atom == undefined) continue;

                if (atom.resn == 'STP') {
                    if (atom.atom == 'POL') {
                        alpha_pol.push(atom.serial);
                    } else if (atom.atom == 'APOL') {
                        alpha_apol.push(atom.serial);
                    }
                }
            }
            return new Array(alpha_pol, alpha_apol);
        }
    }, {
        key: 'chain_layers',
        value: function chain_layers() {

            return $.grep(this.layers, function (l) {
                return !(l instanceof _Pocket.Pocket);
            });
        }
    }, {
        key: 'pocket_layers',
        value: function pocket_layers() {

            return $.grep(this.layers, function (l) {
                return l instanceof _Pocket.Pocket;
            });
        }
    }, {
        key: 'colorByAtomName',
        value: function colorByAtomName(atomlist, residueColors) {
            for (var i in atomlist) {
                var atom = this.atoms[atomlist[i]];
                if (atom == undefined) continue;

                c = residueColors[atom.atom];
                if (c != undefined) atom.color = c;
            }
        }
    }, {
        key: 'draw_labels',
        value: function draw_labels(atoms_id) {
            var me = this;
            this._draw_labels($.map(atoms_id, function (atom_id) {
                return me.atoms[atom_id];
            }));
        }
    }, {
        key: '_draw_labels',
        value: function _draw_labels(atoms) {
            var me = this;
            $.each(atoms, function (i, atom) {
                var bb = me.billboard(me.createTextTex(me.atom_label_id(atom), "30", "#ffffff"));
                bb.position.set(atom.x, atom.y, atom.z);
                me.atom_labels[me.atom_label_id(atom)] = bb;
                me.modelGroup.add(bb);
            }.bind(this));
        }
    }, {
        key: 'atom_label_id',
        value: function atom_label_id(atom) {
            // atom.chain + ":" + ... + ":" + atom.atom
            return atom.resn + ":" + atom.resi;
        }
    }, {
        key: '_init_click_event',
        value: function _init_click_event() {
            var me = this;
            $(this.container).bind('mouseup touchend', function (ev) {
                me.isDragging = false;

                me.adjustPos(ev);
                var x = ev.x,
                    y = ev.y;
                if (x == undefined) return;
                var dx = x - me.mouseStartX,
                    dy = y - me.mouseStartY;
                var r = Math.sqrt(dx * dx + dy * dy);
                if (r > 2) return;
                x -= me.container.position().left;
                y -= me.container.position().top;

                x = ev.offsetX;
                y = ev.offsetY;

                var mvMat = new THREE.Matrix4().multiply($.glmol.camera.matrixWorldInverse, me.modelGroup.matrixWorld);
                var pmvMat = new THREE.Matrix4().multiply($.glmol.camera.projectionMatrix, mvMat);
                var pmvMatInv = new THREE.Matrix4().getInverse(pmvMat);
                var tx = x / me.WIDTH * 2 - 1,
                    ty = 1 - y / me.HEIGHT * 2;
                var nearest = [1, undefined, new TV3(0, 0, 1000)];

                for (var i = 0, ilim = me.atoms.length; i < ilim; i++) {
                    var atom = me.atoms[i];
                    if (atom == undefined) continue;
                    if (atom.x == undefined) continue;
                    if (atom.resn == "HOH") continue;

                    var v = new TV3(atom.x, atom.y, atom.z);
                    pmvMat.multiplyVector3(v);
                    var r2 = (v.x - tx) * (v.x - tx) + (v.y - ty) * (v.y - ty);
                    if (r2 > 0.001) continue;
                    if (v.z < nearest[2].z) nearest = [r2, atom, v];
                    if (r2 > 0.001) continue;
                    if (r2 < nearest[0]) nearest = [r2, atom, v];
                }
                var atom = nearest[1];
                if (atom == undefined) return;

                if (me.atom_labels[me.atom_label_id(atom)] == undefined) {
                    me._draw_labels([atom]);
                } else {
                    me.modelGroup.remove(me.atom_labels[me.atom_label_id(atom)]);
                    delete me.atom_labels[me.atom_label_id(atom)];
                }

                me.show();
            });
        }
    }]);

    return SBGGLMol;
}(_GLmol2.GLmol);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = exports.Layer = function () {
    function Layer(name, atoms, style, hetatm) {
        _classCallCheck(this, Layer);

        this.name = name;
        this.atoms = atoms;
        this.style = style;
        this.visible = true;
        this.hetatm = hetatm;
        this.show_labels = false;
    }

    _createClass(Layer, [{
        key: "refresh",
        value: function refresh() {
            this.glmol.refreshAll();
        }
    }, {
        key: "render",
        value: function render() {
            if (this.visible) {
                if (this.show_labels) {
                    this.glmol.draw_labels(this.atoms);
                }

                this.style.render(this.glmol, this.atoms);
            }
        }
    }, {
        key: "center_view",
        value: function center_view() {
            this.glmol.zoomInto(this.atoms);
            this.glmol.refreshAll();
        }
    }]);

    return Layer;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CartoonStyle = exports.CartoonStyle = function () {
    function CartoonStyle(colorer, curveWidth, thickness) {
        _classCallCheck(this, CartoonStyle);

        this.colorer = colorer;
        this.curveWidth = curveWidth;
        this.thickness = thickness;
    }

    _createClass(CartoonStyle, [{
        key: "render",
        value: function render(glmol, atoms) {
            this.colorer.color(glmol, atoms);
            glmol.drawCartoon(glmol.modelGroup, atoms, this.curveWidth, this.thickness);
        }
    }]);

    return CartoonStyle;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GLmol = __webpack_require__(3);

Object.keys(_GLmol).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GLmol[key];
    }
  });
});

var _SBGGLMol = __webpack_require__(5);

Object.keys(_SBGGLMol).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SBGGLMol[key];
    }
  });
});

var _Layer = __webpack_require__(6);

Object.keys(_Layer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Layer[key];
    }
  });
});

var _SBGBuilder = __webpack_require__(9);

Object.keys(_SBGBuilder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SBGBuilder[key];
    }
  });
});

var _ByAtomColorer = __webpack_require__(11);

Object.keys(_ByAtomColorer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ByAtomColorer[key];
    }
  });
});

var _StickStyle = __webpack_require__(0);

Object.keys(_StickStyle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _StickStyle[key];
    }
  });
});

var _AtomColorer = __webpack_require__(2);

Object.keys(_AtomColorer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AtomColorer[key];
    }
  });
});

var _SphereStyle = __webpack_require__(1);

Object.keys(_SphereStyle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SphereStyle[key];
    }
  });
});

var _CartoonStyle = __webpack_require__(7);

Object.keys(_CartoonStyle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _CartoonStyle[key];
    }
  });
});
// var THREE = require('three');
var THREE = window.THREE;

THREE.ShaderLib.lambert.fragmentShader = THREE.ShaderLib.lambert.fragmentShader.replace('gl_FrontFacing', 'true');
var replaceValue = '#ifdef DOUBLE_SIDED\n if (transformedNormal.z < 0.0) vLightFront = vLightBack;\n #endif\n }';

THREE.ShaderLib.lambert.vertexShader = THREE.ShaderLib.lambert.vertexShader.replace(/\}$/, replaceValue);

THREE.Geometry.prototype.colorAll = function (color) {
  for (var i = 0; i < this.faces.length; i++) {
    this.faces[i].color = color;
  }
};

THREE.Matrix4.prototype.isIdentity = function () {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (this.elements[i * 4 + j] !== (i === j) ? 1 : 0) return false;
    }
  }
  return true;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SBGBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SBGParser = __webpack_require__(10);

var _SBGGLMol = __webpack_require__(5);

var _GLmol = __webpack_require__(3);

var _Pocket = __webpack_require__(4);

var _Layer = __webpack_require__(6);

var _CartoonStyle = __webpack_require__(7);

var _StickStyle = __webpack_require__(0);

var _SphereStyle = __webpack_require__(1);

var _AtomColorer = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SBGBuilder = function () {
	function SBGBuilder() {
		_classCallCheck(this, SBGBuilder);

		this.default_chain_colors = [parseInt('0xDA9629'), parseInt('0xDA2929'), parseInt('0x29DA4F'), parseInt('0x294CDA'), parseInt('0x3A9629'), parseInt('0x29DA40'), parseInt('0xDA0029'), parseInt('0x204C0A'), parseInt('0xDA9620'), parseInt('0xDA2920'), parseInt('0x29DA40'), parseInt('0x294CD0'), parseInt('0x3A9620'), parseInt('0x29DA49'), parseInt('0xDA0020'), parseInt('0x204C00'), parseInt('0xDA9629'), parseInt('0xDA2929'), parseInt('0x29DA4F'), parseInt('0x294CDA'), parseInt('0x3A9629'), parseInt('0x29DA40'), parseInt('0xDA0029'), parseInt('0x204C0A'), parseInt('0xDA9620'), parseInt('0xDA2920'), parseInt('0x29DA40'), parseInt('0x294CD0'), parseInt('0x3A9620'), parseInt('0x29DA49'), parseInt('0xDA0020'), parseInt('0x204C00')];

		this._urls = [];
		this._data = null;
		this._download_fail = function (e) {
			alert("Error loading " + this._urls + " -> " + e);
		};
		this._data_loaded_fn = function (sbgglmol) {};
		this._div_name = null;
		this.parser = new _SBGParser.SBGParser();
		this.pockets_to_load = [];
		this.pockets_data = [];

		this.pdb_strs_to_add = [];
	}

	_createClass(SBGBuilder, [{
		key: 'build',
		value: function build() {
			if (this._div_name == null) {
				throw "div not initialized...";
			}

			if (this._urls.length > 0) {
				this._load_urls(this._urls.reverse());
				return null;
			}

			if (this._data == null) {
				throw "pdb data not initialized";
			} else {
				return this._build();
			}
		}
	}, {
		key: '_load_urls',
		value: function _load_urls(urls) {
			if (urls.length > 0) {
				var url_handler = urls.pop();
				if (url_handler.length == 2) {
					$.get(url_handler[0]).done(function (data) {
						url_handler[1](data);
						this._load_urls(urls);
					}.bind(this)).fail(this._download_fail.bind(this));
				} else {
					this._execute_cascade_url(url_handler[0].reverse(), url_handler[1], url_handler[2], urls);
				}
			}
		}
	}, {
		key: '_execute_cascade_url',
		value: function _execute_cascade_url(urls, handler, params, url_groups) {
			if (urls.length == 0) {

				handler.apply(this, params);
				if (url_groups.length == 0) {
					this._build();
				} else {
					this._load_urls(url_groups);
				}
			} else {
				var url = urls.pop();
				$.get(url).success(function (data) {
					params.push(data);
					this._execute_cascade_url(urls, handler, params, url_groups);
				}.bind(this)).fail(this._download_fail.bind(this));
			}
		}
	}, {
		key: 'data',
		value: function data(_data) {
			this._data = _data;
			return this;
		}
	}, {
		key: 'div',
		value: function div(div_name) {
			this._div_name = div_name;
			return this;
		}
	}, {
		key: 'pdb',
		value: function pdb(_pdb) {
			this.url('http://www.rcsb.org/pdb/files/' + _pdb + '.pdb');
			return this;
		}
	}, {
		key: 'url',
		value: function url(_url) {
			this._urls = [[_url, this._build_first_phase.bind(this)]];
			return this;
		}
	}, {
		key: 'layer_list',
		value: function layer_list(div_id) {
			this.layer_list_id = div_id;
			return this;
		}
	}, {
		key: 'pocket_url',
		value: function pocket_url(pocket_name, url_pdb_str_residues, url_pdb_str_alphaSpheres) {
			this.pdb_strs_to_add.push(url_pdb_str_alphaSpheres);
			this._urls.push([[url_pdb_str_residues, url_pdb_str_alphaSpheres], this._handle_pocket_data.bind(this), [pocket_name]]);
			return this;
		}
	}, {
		key: 'add_pdb_str_data_url',
		value: function add_pdb_str_data_url(url) {
			this.pdb_strs_to_add.push(url);
			return this;
		}
	}, {
		key: '_handle_pocket_data',
		value: function _handle_pocket_data(pocket_name, pocket_atoms_str, pocket_alpha_spheres_str) {
			this.pockets_data.push([pocket_name, pocket_atoms_str, pocket_alpha_spheres_str]);
		}
	}, {
		key: 'load_pocket',
		value: function load_pocket(glmol, pocket_name, pocket_atoms_str, pocket_alpha_spheres_str) {

			glmol.add_pdb_str(pocket_alpha_spheres_str);

			var pocket_atom_index_list = pocket_atoms_str; // this.parser.atomIds_from_pdb(pocket_atoms_str) ;
			var alpha_spheres_index_list = this.parser.atomIds_from_pdb(pocket_alpha_spheres_str);

			var style = new _StickStyle.StickStyle(new _AtomColorer.AtomColorer(glmol.selected_atoms_color));
			var pocket = new _Pocket.Pocket(pocket_name, pocket_atom_index_list, alpha_spheres_index_list, style);
			glmol.add_layer(pocket);
		}
	}, {
		key: '_load_data',
		value: function _load_data(data) {
			this._data = data;
			this._build();
		}
	}, {
		key: '_build_first_phase',
		value: function _build_first_phase(data) {
			this.data(data);
			this.glmol = new _GLmol.GLmol(this._div_name, true);
			this.glmol.data_loaded = function (glmol) {};
			this.glmol.load_data(this._data);
		}
	}, {
		key: '_build',
		value: function _build() {
			if (this.glmol == null) {
				this.glmol = new _GLmol.GLmol(this._div_name, true);
				this.glmol.layers = [];
				this.glmol.selected_atoms = [];
				this.glmol.atom_labels = [];
				this.glmol._init_click_event();
			}
			var glmol = this.glmol;
			glmol.data_loaded = function () {
				this._default_init(glmol);
				this._data_loaded_fn(glmol);
			}.bind(this);
			glmol.load_data(this._data);
			$.each(this.pdb_strs_to_add, function (i, pdb_str) {
				glmol.add_pdb_str(pdb_str);
			});
			return glmol;
		}
	}, {
		key: '_default_init',
		value: function _default_init(glmol) {

			this._init_chains(glmol);
			this._init_heatoms(glmol);

			this._init_pockets(glmol);
			this._init_controls(glmol);
		}
	}, {
		key: '_init_pockets',
		value: function _init_pockets(glmol) {

			if (this.pockets_data.length > 0) {

				$.each(this.pockets_data, function (i, pocket_arr) {

					var pocket_name = pocket_arr[0];
					var pocket_atoms_str = pocket_arr[1];
					var raw_str_alpha_spheres = pocket_arr[2];

					var str_alpha_spheres = this.parser.alpha_spheres_from_pdb(raw_str_alpha_spheres);
					this.load_pocket(glmol, pocket_name, pocket_atoms_str, str_alpha_spheres);
				}.bind(this));
			}
		}
	}, {
		key: '_init_controls',
		value: function _init_controls(glmol) {

			if (this.layer_list_id != null) {
				this._layer_list = new $.UILayerList($('#' + this.layer_list_id), glmol);
				this._layer_list.init();
			}
		}
		/**
   * Carga un layer por cadena
   */

	}, {
		key: '_init_chains',
		value: function _init_chains(glmol) {

			$.each(glmol.chains, function (i, chain) {
				//if (chain != " ") {
				// BORRAR esta cond es para que no cuente a las alpha spheres
				// como un layer mas, si hay un modelo esto no anda
				var chain_style = new _CartoonStyle.CartoonStyle(new $.AtomColorer(this.default_chain_colors[i]), 0.2, 0.2);
				var layer = new _Layer.Layer(chain, glmol.chain_atoms(chain), chain_style, false);
				glmol.add_layer(layer);
			}.bind(this));
		}
		/**
   * Carga el layer de heatoms
   */

	}, {
		key: '_init_heatoms',
		value: function _init_heatoms(glmol) {
			var heatoms = glmol.removeAlphaSpheres(glmol.removeSolvents(glmol.getHetatms(glmol.getAllAtoms())));
			if (heatoms.length > 0) {
				style = new _SphereStyle.SphereStyle(new ByAtomColorer({}), 1);
				layer = new _Layer.Layer('heatoms', heatoms, style, true);
				glmol.add_layer(layer);
			}
		}
	}]);

	return SBGBuilder;
}();

exports.SBGBuilder = SBGBuilder;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SBGParser = exports.SBGParser = function () {
	function SBGParser() {
		_classCallCheck(this, SBGParser);
	}

	_createClass(SBGParser, [{
		key: '_atom_from_line',
		value: function _atom_from_line(line) {

			return parseInt(line.substr(6, 5));
		}
	}, {
		key: '_residue_from_line',
		value: function _residue_from_line(line) {
			return line.substring(22, 26).trim();
		}
	}, {
		key: 'isATOMLine',
		value: function isATOMLine(pdbLine) {
			return pdbLine.substring(0, 4) == 'ATOM';
		}
	}, {
		key: 'isHETATMLine',
		value: function isHETATMLine(pdbLine) {
			return pdbLine.substring(0, 6) == 'HETATM';
		}
	}, {
		key: 'isAlphaSphereLine',
		value: function isAlphaSphereLine(pdbLine) {
			return pdbLine.substr(17, 3) == 'STP';
		}
	}, {
		key: 'atomIds_from_pdb',
		value: function atomIds_from_pdb(pdb_str) {
			var atom_index_list = [];
			$.each(pdb_str.split("\n"), function (i, line) {
				if (this.isATOMLine(line) || this.isHETATMLine(line)) {
					atomSeq = this._atom_from_line(line);
					atom_index_list.push(atomSeq);
				}
			}.bind(this));
			return atom_index_list;
		}
		/**
   * Return a map of pocketNumber:pocketAlphaSpheresPDBString
   */

	}, {
		key: 'map_alpha_spheres_from_pdb',
		value: function map_alpha_spheres_from_pdb(pdb_str, pocket_numbers) {
			/**
    * Alpha sphere "residue" is the pocket number
    */

			var pocket_alpha_spheres_str = {};
			$.each(pocket_numbers, function (j, pocket_number) {
				pocket_alpha_spheres_str[pocket_number + 1] = "";
			});

			$.each(pdb_str.split("\n"), function (i, line) {
				if (this.isAlphaSphereLine(line)) {
					var pocket_number = parseInt(this._residue_from_line(line));
					if ($.isDefAndNotNull(pocket_alpha_spheres_str[pocket_number + 1])) {
						pocket_alpha_spheres_str[pocket_number + 1] += line + "\n";
					}
				}
			}.bind(this));
			return pocket_alpha_spheres_str;
		}
	}, {
		key: 'alpha_spheres_from_pdb',
		value: function alpha_spheres_from_pdb(pdb_str) {
			var pocket_alpha_spheres = [];
			$.each(pdb_str.split("\n"), function (i, line) {

				if (this.isAlphaSphereLine(line)) {
					pocket_alpha_spheres.push(line);
				}
			}.bind(this));
			return pocket_alpha_spheres.join("\n");
		}
	}]);

	return SBGParser;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ByAtomColorer = exports.ByAtomColorer = function () {
    function ByAtomColorer(color_map) {
        _classCallCheck(this, ByAtomColorer);

        if (color_map) {
            this.atom_color_map = color_map;
        } else {
            this.atom_color_map = {
                "H": 0xCCCCCC, "C": 0xAAAAAA, "O": 0xCC0000, "N": 0x0000CC, "S": 0xCCCC00, "P": 0x6622CC,
                "F": 0x00CC00, "CL": 0x00CC00, "BR": 0x882200, "I": 0x6600AA,
                "FE": 0xCC6600, "CA": 0x8888AA
            };
        }
    }

    _createClass(ByAtomColorer, [{
        key: "color",
        value: function color(glmol, atoms) {
            glmol.colorByAtom(atoms, this.atom_color_map);
        }
    }]);

    return ByAtomColorer;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=sbgglmol.js.map