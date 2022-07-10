import * as THREE from 'three'
import { WEBGL } from './webgl'
//import './modal'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


if (WEBGL.isWebGLAvailable()) {
  //var startPointsPython = [[0.4967141530112327, -0.13826430117118466, 0.6476885381006925], [1.5230298564080254, -0.23415337472333597, -0.23413695694918055], [1.5792128155073915, 0.7674347291529088, -0.4694743859349521], [0.5425600435859647, -0.46341769281246226, -0.46572975357025687], [0.24196227156603412, -1.913280244657798, -1.7249178325130328], [-0.5622875292409727, -1.0128311203344238, 0.3142473325952739], [-0.9080240755212109, -1.4123037013352915, 1.465648768921554], [-0.22577630048653566, 0.06752820468792384, -1.4247481862134568], [-0.5443827245251827, 0.11092258970986608, -1.1509935774223028], [0.37569801834567196, -0.600638689918805, -0.2916937497932768], [-0.6017066122293969, 1.8522781845089378, -0.013497224737933921], [-1.0577109289559004, 0.822544912103189, -1.2208436499710222], [0.2088635950047554, -1.9596701238797756, -1.3281860488984305], [0.19686123586912352, 0.7384665799954104, 0.1713682811899705], [-0.11564828238824053, -0.3011036955892888, -1.4785219903674274], [-0.7198442083947086, -0.4606387709597875, 1.0571222262189157], [0.3436182895684614, -1.763040155362734, 0.324083969394795], [-0.38508228041631654, -0.6769220003059587, 0.6116762888408679], [1.030999522495951, 0.9312801191161986, -0.8392175232226385], [-0.3092123758512146, 0.33126343140356396, 0.9755451271223592], [-0.47917423784528995, -0.18565897666381712, -1.1063349740060282], [-1.1962066240806708, 0.812525822394198, 1.356240028570823], [-0.07201012158033385, 1.0035328978920242, 0.36163602504763415], [-0.6451197546051243, 0.36139560550841393, 1.5380365664659692], [-0.03582603910995154, 1.5646436558140062, -2.6197451040897444], [0.8219025043752238, 0.08704706823817122, -0.29900735046586746], [0.0917607765355023, -1.9875689146008928, -0.21967188783751193], [0.3571125715117464, 1.477894044741516, -0.5182702182736474], [-0.8084936028931876, -0.5017570435845365, 0.9154021177020741], [0.32875110965968446, -0.5297602037670388, 0.5132674331133561], [0.09707754934804039, 0.9686449905328892, -0.7020530938773524], [-0.3276621465977682, -0.39210815313215763, -1.4635149481321186], [0.29612027706457605, 0.26105527217988933, 0.00511345664246089], [-0.23458713337514692, -1.4153707420504142, -0.42064532276535904], [-0.3427145165267695, -0.8022772692216189, -0.16128571166600914], [0.4040508568145384, 1.8861859012105302, 0.17457781283183896], [0.25755039072276437, -0.07444591576616721, -1.9187712152990415], [-0.026513875449216878, 0.06023020994102644, 2.463242112485286], [-0.19236096478112252, 0.30154734233361247, -0.03471176970524331], [-1.168678037619532, 1.1428228145150205, 0.7519330326867741], [0.7910319470430469, -0.9093874547947389, 1.4027943109360992], [-1.4018510627922809, 0.5868570938002703, 2.1904556258099785], [-0.9905363251306883, -0.5662977296027719, 0.09965136508764122], [-0.5034756541161992, -1.5506634310661327, 0.06856297480602733], [-1.0623037137261049, 0.4735924306351816, -0.9194242342338032], [1.5499344050175394, -0.7832532923362371, -0.3220615162056756], [0.8135172173696698, -1.2308643164339552, 0.22745993460412942], [1.307142754282428, -1.6074832345612275, 0.1846338585323042], [0.25988279424842353, 0.7818228717773104, -1.236950710878082], [-1.3204566130842763, 0.5219415656168976, 0.29698467323318606], [0.25049285034587654, 0.3464482094969757, -0.6800247215784908], [0.23225369716100355, 0.29307247329868125, -0.7143514180263678], [1.8657745111447566, 0.4738329209117875, -1.1913034972026486], [0.6565536086338297, -0.9746816702273214, 0.787084603742452], [1.158595579007404, -0.8206823183517105, 0.9633761292443218], [0.4127809269364983, 0.82206015999449, 1.8967929826539474], [-0.2453881160028705, -0.7537361643574896, -0.8895144296255233], [-0.8158102849654383, -0.0771017094141042, 0.3411519748166439], [0.27669079933001905, 0.8271832490360238, 0.01300189187790702], [1.4535340771573169, -0.2646568332379561, 2.720169166589619], [0.6256673477650062, -0.8571575564162826, -1.0708924980611123], [0.4824724152431853, -0.2234627853258509, 0.714000494092092], [0.47323762457354485, -0.07282891265687277, -0.846793718068405], [-1.5148472246858646, -0.4465149520670211, 0.8563987943234723]];

  var camera, scene, renderer, gpuCompute, geometry, 
    positionVariable, velocityVariable, accelerationVariable, densityVariable,
    positionUniforms, velocityUniforms, accelerationUniforms, densityUniforms, points, controls,
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
    //scene.fog = new THREE.Fog( 0x050505, 3000, 4000 );
    //scene.fog = new THREE.FogExp2(0x050505, 0.0004);

    //renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer = new THREE.WebGLRenderer();
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
  }

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

    points.material.uniforms.texturePosition.value = positionVariable.renderTargets[positionTextureIndex].texture;

    renderer.render(scene, camera);
  }

} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
