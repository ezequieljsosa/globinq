// var THREE = require('three');
var THREE = window.THREE;

THREE.ShaderLib.lambert.fragmentShader = THREE.ShaderLib.lambert.fragmentShader.replace('gl_FrontFacing', 'true');
let replaceValue = '#ifdef DOUBLE_SIDED\n if (transformedNormal.z < 0.0) vLightFront = vLightBack;\n #endif\n }';

THREE.ShaderLib.lambert.vertexShader = THREE.ShaderLib.lambert.vertexShader.replace(/\}$/, replaceValue);

THREE.Geometry.prototype.colorAll = function (color) {
 for (let i = 0; i < this.faces.length; i++) {
  this.faces[i].color = color;
 }
};

THREE.Matrix4.prototype.isIdentity = function () {
 for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
   if (this.elements[i * 4 + j] !== (i === j) ? 1 : 0) return false;
  }}
 return true;
};

export * from './GLmol.js';
export * from './model/SBGGLMol.js';
export * from './model/Layer.js';
export * from './utils/SBGBuilder.js';
export * from './model/colorer/ByAtomColorer.js';
export * from './model/style/StickStyle.js';
export * from './model/colorer/AtomColorer.js';
export * from './model/style/SphereStyle.js';
export * from './model/style/CartoonStyle.js';





