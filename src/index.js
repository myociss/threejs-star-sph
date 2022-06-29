import * as THREE from 'three'
import { WEBGL } from './webgl'
//import './modal'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'

if (WEBGL.isWebGLAvailable()) {
  var camera, scene, renderer, gpuCompute, geometry, positionVariable, velocityVariable, accelerationVariable,
    positionUniforms, velocityUniforms, points,
    accelerationTextureIndex, velocityTextureIndex, positionTextureIndex;

  var textureDim = 8;
  var nParticles = textureDim * textureDim;

  //var particleScale = 400;
  var particleStartX = -1200.0;
  var particleYConst = 80.0;

  var deltaT = 0.39269908;

  initScene();
  initGPU();
  initParticles();

  //points.material.uniforms.texturePosition.value = gpuCompute.getAlternateRenderTarget( positionVariable ).texture;

  /*computeAcceleration();

  computeVelocity();
  computePosition();
  computeAcceleration();

  points.material.uniforms.texturePosition.value = positionVariable.renderTargets[positionTextureIndex].texture;
  //console.log(points.material.uniforms.texturePosition.value.image);

  render();*/

  computeAcceleration();

  //animate();

  //render();
  //render();

  //for (var a=0; a < 2; a++){
  //  render();
  //}

  function initScene() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      5,
      3500
    );

    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

  }

  function initGPU(){
    accelerationTextureIndex = 0;
    velocityTextureIndex = 0;
    positionTextureIndex = 0;

    gpuCompute = new GPUComputationRenderer(textureDim,textureDim,renderer);

    var dtPosition = gpuCompute.createTexture();

    var posArray = dtPosition.image.data;

    for (var i=0; i < posArray.length; i+=4){
      var x = particleStartX;
      var y = particleStartX + particleYConst * (i / 4);
      var z = 0;

      posArray[i + 0] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;
      posArray[i + 3] = 1;
    }

	  var dtVelocity = gpuCompute.createTexture();

    var velArray = dtVelocity.image.data;

    for (var i=0; i < velArray.length; i+=4){
      velArray[i + 0] = deltaT;
      velArray[i + 1] = 0;
      velArray[i + 2] = 0;
      velArray[i + 3] = 0;
    }

    var dtAcceleration = gpuCompute.createTexture();

    var accArray = dtAcceleration.image.data;

    for (var i=0; i < accArray.length; i+=4){
      accArray[i + 0] = 0;
      accArray[i + 1] = 0;
      accArray[i + 2] = 0;
      accArray[i + 3] = 0;
    }

    positionVariable = gpuCompute.addVariable("texturePosition",
        document.getElementById('fragmentShaderPosition').textContent, dtPosition);

    velocityVariable = gpuCompute.addVariable("textureVelocity",
        document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);

    accelerationVariable = gpuCompute.addVariable("textureAcceleration",
        document.getElementById('fragmentShaderAcceleration').textContent, dtAcceleration);

    gpuCompute.setVariableDependencies(accelerationVariable, [positionVariable]);
    gpuCompute.setVariableDependencies(velocityVariable, [velocityVariable, accelerationVariable]);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

    positionUniforms = positionVariable.material.uniforms;
    positionUniforms.deltaT = {value: deltaT};

    velocityUniforms = velocityVariable.material.uniforms;
    velocityUniforms.deltaT = {value: deltaT};

    var error = gpuCompute.init();
    if ( error !== null ) {
      console.error( error );
    }
  }


  function initParticles(){

    geometry = new THREE.BufferGeometry();

    var vertices = new THREE.BufferAttribute( new Float32Array( nParticles * 3 ), 3 );
    var references = new THREE.BufferAttribute( new Float32Array( nParticles * 2 ), 2 );

    for (var i=0; i<nParticles; i++){
        var u = (i % textureDim) / textureDim;
        var v = ~~(i/textureDim) / textureDim;
        references.array[i * 2] = u;
        references.array[i * 2 + 1]=v;
    }

    geometry.setAttribute('position',vertices);
    geometry.setAttribute('reference',references);


    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ 'fog' ], { texturePosition: {value: null} }
      ] ),
      vertexShader: document.getElementById('physicsVertexShader').textContent,
      fragmentShader: document.getElementById('pointFragmentShader').textContent,
      vertexColors: true,
      fog: true
    });

    //material.needsUpdate = true;

    points = new THREE.Points( geometry, material );
    //points.matrixAutoUpdate = false;
    //points.updateMatrix();
    scene.add( points );
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function computeAcceleration(){
    var uniforms = accelerationVariable.material.uniforms;
    var nextIdx = accelerationTextureIndex === 0 ? 1 : 0;
    uniforms['texturePosition'].value = positionVariable.renderTargets[ positionTextureIndex ].texture;
    var target = accelerationVariable.renderTargets[nextIdx];
    gpuCompute.doRenderTarget(accelerationVariable.material,target);
    accelerationTextureIndex = nextIdx;
    //alert('hm...');
  }

  function computeVelocity(){
    var uniforms = velocityVariable.material.uniforms;
    var nextIdx = velocityTextureIndex === 0 ? 1 : 0;
    uniforms['textureAcceleration'].value = accelerationVariable.renderTargets[ accelerationTextureIndex ].texture;
    uniforms['textureVelocity'].value = velocityVariable.renderTargets[ velocityTextureIndex ].texture;

    var target = velocityVariable.renderTargets[nextIdx];
    gpuCompute.doRenderTarget(velocityVariable.material,target);
    velocityTextureIndex = nextIdx;
  }

  function computePosition(){
    var uniforms = positionVariable.material.uniforms;
    var nextIdx = positionTextureIndex === 0 ? 1 : 0;
    uniforms['texturePosition'].value = positionVariable.renderTargets[ positionTextureIndex ].texture;
    uniforms['textureVelocity'].value = velocityVariable.renderTargets[ velocityTextureIndex ].texture;

    var target = positionVariable.renderTargets[nextIdx];
    gpuCompute.doRenderTarget(positionVariable.material,target);
    positionTextureIndex = nextIdx;
  }

  function animate(){
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    //computeAcceleration();

    computeVelocity();
    computePosition();
    computeAcceleration();
    computeVelocity();

    points.material.uniforms.texturePosition.value = positionVariable.renderTargets[positionTextureIndex].texture;

    renderer.render(scene, camera);
  }

} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
