# threejs-star-sph

Smoothed particle hydrodynamics example in Three.js

## About

Simulates the formation of a star based on smoothed particle hydrodynamics based on the [tutorial](https://philip-mocz.medium.com/create-your-own-smoothed-particle-hydrodynamics-simulation-with-python-76e1cec505f1) by Philip Mocz. Uses GLSL shaders to solve the differential equation at each step and then render a particle cloud represented by an InstancedMesh of spheres.

Built with [three-js-webpack](https://github.com/aakatev/three-js-webpack).