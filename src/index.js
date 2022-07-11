import * as THREE from 'three'
import { WEBGL } from './webgl'
//import './modal'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


if (WEBGL.isWebGLAvailable()) {

  var camera, scene, renderer, gpuCompute, geometry, 
    positionVariable, velocityVariable, accelerationVariable, densityVariable,
    positionUniforms, velocityUniforms, accelerationUniforms, densityUniforms, mesh, points, controls,
    accelerationTextureIndex, velocityTextureIndex, positionTextureIndex, densityTextureIndex;

  var textureDim = 64;
  var nParticles = textureDim * textureDim;

  var smoothingLength = 0.1;
  var polytropicIndex = 1.0;
  var equationOfStateConst = 0.1;
  var particleMass = 2.0 / nParticles;
  var lambda = 2.01203286;
  var viscosity = 1.0;

  var deltaT = 0.04;

  initScene();
  initGPU();
  initParticles();

  // compute position with zero velocity to get particle densities
  //computePosition();

  computeDensity();  
  computeAcceleration();

  //render();

  //for (var i=0;i<100;i++){
  //  render();
  //}
  
  //var tex=densityVariable.renderTargets[ densityTextureIndex ];
  
  //var tex=accelerationVariable.renderTargets[ accelerationTextureIndex ];
  //var pixelBuffer = new Float32Array( textureDim * textureDim * 4 );
  //renderer.readRenderTargetPixels( tex, 0, 0, textureDim, textureDim, pixelBuffer );
  //console.log(pixelBuffer);


  animate();
  //render();

  function initScene() {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      5,
      3500
    );

    //camera.position.z = 2750;
    camera.position.z = 1500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog( 0x050505, 1000, 3000 );
    //scene.fog = new THREE.Fog( 0x050505, 3000, 4000 );
    //scene.fog = new THREE.FogExp2(0x050505, 0.0004);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //take this out
    //renderer.autoClear=false;
    document.body.appendChild(renderer.domElement);

    //controls = new OrbitControls( camera, renderer.domElement );
    //controls.update();

    window.addEventListener('resize', onWindowResize, false);

  }

  function initGPU(){
    accelerationTextureIndex = 0;
    velocityTextureIndex = 0;
    positionTextureIndex = 0;
    densityTextureIndex = 0;

    gpuCompute = new GPUComputationRenderer(textureDim,textureDim,renderer);

    var dtPosition = gpuCompute.createTexture();

    var posArray = dtPosition.image.data;

    for (var i=0; i < posArray.length; i+=4){
      var x = randNormal();
      var y = randNormal();
      var z = randNormal();

      posArray[i + 0] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;
      posArray[i + 3] = 1;
    }

    /*var posArrayCounter = 0;

    for (var i=0; i < startPointsPython.length; i++){
      console.log(i);
      posArray[posArrayCounter + 0] = startPointsPython[i][0];
      posArray[posArrayCounter + 1] = startPointsPython[i][1];
      posArray[posArrayCounter + 2] = startPointsPython[i][2];
      posArray[posArrayCounter + 3] = 1;

      posArrayCounter += 4;
    }*/

	  var dtVelocity = gpuCompute.createTexture();

    var velArray = dtVelocity.image.data;

    for (var i=0; i < velArray.length; i+=4){
      velArray[i + 0] = 0;
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

    var dtDensity = gpuCompute.createTexture();

    var densArray = dtDensity.image.data;

    for (var i=0; i < accArray.length; i+=4){
      densArray[i + 0] = 0;
      densArray[i + 1] = 0;
      densArray[i + 2] = 0;
      densArray[i + 3] = 0;
    }

    positionVariable = gpuCompute.addVariable("texturePosition",
      document.getElementById('fragmentShaderPosition').textContent, dtPosition);

    velocityVariable = gpuCompute.addVariable("textureVelocity",
      document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);

    accelerationVariable = gpuCompute.addVariable("textureAcceleration",
      document.getElementById('fragmentShaderAcceleration').textContent, dtAcceleration);

    densityVariable = gpuCompute.addVariable("textureDensity",
      document.getElementById('fragmentShaderDensity').textContent, dtDensity);

    gpuCompute.setVariableDependencies(accelerationVariable, [positionVariable, velocityVariable, densityVariable]);
    gpuCompute.setVariableDependencies(velocityVariable, [velocityVariable, accelerationVariable]);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
    gpuCompute.setVariableDependencies(densityVariable, [positionVariable]);

    positionUniforms = positionVariable.material.uniforms;
    positionUniforms.deltaT = {value: deltaT};
    
    densityUniforms = densityVariable.material.uniforms;
    densityUniforms.smoothingLength = {value: smoothingLength};
    densityUniforms.particleMass = {value: particleMass};

    velocityUniforms = velocityVariable.material.uniforms;
    velocityUniforms.deltaT = {value: deltaT};

    accelerationUniforms = accelerationVariable.material.uniforms;
    accelerationUniforms.equationOfStateConst = {value: equationOfStateConst};
    accelerationUniforms.polytropicIndex = {value: polytropicIndex};
    accelerationUniforms.smoothingLength = {value: smoothingLength};
    accelerationUniforms.particleMass = {value: particleMass};
    accelerationUniforms.lambda = {value: lambda};
    accelerationUniforms.viscosity = {value: viscosity};

    var error = gpuCompute.init();
    if ( error !== null ) {
      console.error( error );
    }
  }

  function initParticles(){
    //var circGeom = new THREE.CircleGeometry(10,6);
    //var circGeom = new THREE.IcosahedronGeometry(20.0,0);
    var circGeom = new THREE.SphereGeometry( 15, 32, 16 );
    var circBuffer = new THREE.BufferGeometry().fromGeometry(circGeom);
    console.log(circBuffer.attributes);
    
    
    geometry = new THREE.InstancedBufferGeometry();
    geometry.index = circBuffer.index;
    geometry.attributes = circBuffer.attributes;

    var references = new THREE.InstancedBufferAttribute( new Float32Array( nParticles * 2 ), 2 );
    for (var i=0; i<nParticles; i++){
      var u = (i % textureDim) / textureDim;
      var v = ~~(i/textureDim) / textureDim;
      references.array[i * 2] = u;
      references.array[i * 2 + 1]=v;
    }

    //console.log(geometry);

    geometry.setAttribute('reference',references);
    geometry.setAttribute('pos_offset', geometry.attributes.position);

    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ 'fog' ], 
        { texturePosition: {value: null}, 
          scale: {value: 1500.0},
          Ka: { value: new THREE.Vector3(0.0, 1.0, 1.0) },
          Kd: { value: new THREE.Vector3(0.0, 1.0, 1.0) },
          Ks: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
          LightIntensity: { value: new THREE.Vector4(0.5, 0.5, 0.5, 1.0) },
          LightPosition: { value: new THREE.Vector4(0.0, 1000.0, 0.0, 1.0) },
          Shininess: { value: 200.0 } }
      ] ),
      vertexShader: document.getElementById('physicsVertexShader').textContent,
      fragmentShader: document.getElementById('pointFragmentShader').textContent,
      //vertexColors: true,
      fog: true,
      depthTest: true,
      depthWrite: true
    });

    mesh = new THREE.Mesh(geometry,material);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    scene.add(mesh);
  }


  /*function initParticles(){

    geometry = new THREE.BufferGeometry();

    console.log(geometry.attributes);

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

    console.log(geometry.attributes);


    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ 'fog' ], 
        { texturePosition: {value: null}, 
          scale: {value: 500.0} }
      ] ),
      vertexShader: document.getElementById('physicsVertexShader').textContent,
      fragmentShader: document.getElementById('pointFragmentShader').textContent,
      vertexColors: true,
      fog: true
    });

    points = new THREE.Points( geometry, material );
    points.matrixAutoUpdate = false;
    points.updateMatrix();

    //points.needsUpdate=true;
    scene.add( points );
  }*/

  function randNormal() {
    var a = 0, b = 0;
    while(a === 0) a = Math.random(); //Converting [0,1) to (0,1)
    while(b === 0) b = Math.random();
    return Math.sqrt( -2.0 * Math.log( a ) ) * Math.cos( 2.0 * Math.PI * b );
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
    uniforms['textureVelocity'].value = velocityVariable.renderTargets[ velocityTextureIndex ].texture;
    uniforms['textureDensity'].value = densityVariable.renderTargets[ densityTextureIndex ].texture;
    var target = accelerationVariable.renderTargets[nextIdx];
    gpuCompute.doRenderTarget(accelerationVariable.material,target);
    accelerationTextureIndex = nextIdx;
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

  function computeDensity(){
    var uniforms = densityVariable.material.uniforms;
    var nextIdx = densityTextureIndex === 0 ? 1 : 0;
    uniforms['texturePosition'].value = positionVariable.renderTargets[ positionTextureIndex ].texture;

    var target = densityVariable.renderTargets[nextIdx];
    gpuCompute.doRenderTarget(densityVariable.material,target);
    densityTextureIndex = nextIdx;
  }

  function animate(){
    requestAnimationFrame(animate);
    //controls.update();
    render();
  }

  function render() {

    computeVelocity();
    computePosition();
    computeDensity();
    computeAcceleration();
    computeVelocity();

    //console.log(positionVariable.renderTargets[positionTextureIndex].texture);

    //points.material.uniforms.texturePosition.value = positionVariable.renderTargets[positionTextureIndex].texture;
    mesh.material.uniforms.texturePosition.value = positionVariable.renderTargets[positionTextureIndex].texture;

    renderer.render(scene, camera);
  }

} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
