import * as THREE from 'three'
import { WEBGL } from './webgl'
//import './modal'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (WEBGL.isWebGLAvailable()) {
    let camera, scene, renderer, positionVariable, gpuCompute;

    let points;

    var nParticles = 64*64;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 5, 3500 );
    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    const particles = 5000;

    const geometry = new THREE.BufferGeometry();

    var vertices = new THREE.BufferAttribute( new Float32Array( nParticles * 3 ), 3 );
    var references = new THREE.BufferAttribute( new Float32Array( nParticles * 2 ), 2 );

    for (var i=0; i<nParticles; i++){
        var u = (i % 64) / 64;
        var v = ~~(i/64) / 64;
        references.array[i * 2] = u;
        references.array[i * 2 + 1]=v;
    }

    geometry.setAttribute('position',vertices);
    geometry.setAttribute('reference',references);

    /*const positions = [];
    const colors = [];

    const color = new THREE.Color();

    const n = 1000, n2 = n / 2;

    for ( let i = 0; i < particles; i ++ ) {

        // positions

        const x = Math.random() * n - n2;
        const y = Math.random() * n - n2;
        const z = Math.random() * n - n2;

        positions.push( x, y, z );

        // colors

        const vx = ( x / n ) + 0.5;
        const vy = ( y / n ) + 0.5;
        const vz = ( z / n ) + 0.5;

        color.setRGB( vx, vy, vz );

        colors.push( color.r, color.g, color.b );

    }*/

    //geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    //geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    //geometry.computeBoundingSphere();

    //const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );

    const material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib[ 'fog' ],
            { texturePosition: {value: null}, scale: {value: 1.0} }
        ] ),
        vertexShader: document.getElementById('physicsVertexShader').textContent,
        fragmentShader: document.getElementById('pointFragmentShader').textContent,
        vertexColors: true,
        fog: true
    });

    points = new THREE.Points( geometry, material );
    scene.add( points );

    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio( window.innerWidth, window.innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

    gpuCompute = new GPUComputationRenderer(64,64,renderer);

    var dtPosition = gpuCompute.createTexture();

    var posArray = dtPosition.image.data;

    for (var i=0; i < posArray.length; i+=4){
      /*var x = randNormal();
      var y = randNormal();
      var z = randNormal();*/

      var x = 1000.0 * (Math.random() - 0.5);
      var y = 1000.0 * (Math.random() - 0.5);
      var z = 1000.0 * (Math.random() - 0.5);

      posArray[i + 0] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;
      posArray[i + 3] = 1;
    }

    positionVariable = gpuCompute.addVariable("texturePosition",
        "", dtPosition);

    var error = gpuCompute.init();
    if ( error !== null ) {
        console.error( error );
    }

    //points.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget('texturePosition').texture;

    points.material.uniforms.texturePosition.value = dtPosition;
    
    render();
    //init();


    
    /*var scene = new THREE.Scene();

    //var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20;

    controls = new THREE.OrbitControls(camera);
    controls.enableZoom = false;
    controls.addEventListener('change',render);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    alert("everything good");
    //console.log('....');

    const particles = 5000;

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    const n = 1000, n2 = n / 2; // particles spread in the cube

    for ( let i = 0; i < particles; i ++ ) {

            // positions

            const x = Math.random();
            const y = Math.random();
            const z = Math.random();

            positions.push( x, y, z );

            // colors

            const vx = Math.random();
            const vy = Math.random();
            const vz = Math.random();

            color.setRGB( vx, vy, vz );

            colors.push( color.r, color.g, color.b );

        }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        const material = new THREE.PointsMaterial( { sizeAttenuation:true,size: 1, vertexColors: true } );

        points = new THREE.Points( geometry, material );
        scene.add( points );

    render();
    */
    function render(){
        renderer.render( scene, camera );
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }
    
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
  