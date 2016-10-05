window.onload = function() {
    // detector
    // main
    var container;
    var stats;
    var mouseX, mouseY;
    var camera, scene, renderer, light, sunLight;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth * 0.5;
    var windowHalfY = window.innerHeight * 0.5;

    init();
    render();

    function init() {

        // create a div element to contain the render
        container = document.createElement('div');
        document.body.appendChild(container);

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.set(0, 500, 1000);
        camera.lookAt(scene.position);
        //scene.add(camera);

        scene.add(new THREE.AmbientLight(0x404040));


        // loading cube material
        var path = "resources/textures/skybox/";
        var format = '.jpg';
        var urls = [
            path + 's_px' + format, path + 's_nx' + format,
            path + 's_py' + format, path + 's_ny' + format,
            path + 's_pz' + format, path + 's_nz' + format
        ];
        var textureCube = THREE.ImageUtils.loadTextureCube(urls);

        // skybox
        var shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = textureCube;
        var material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        var skybox = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
        //scene.add(skybox);


        // create the particle variables
        var particleCount = 18000,
            particles = new THREE.Geometry(),
            pMaterial = new THREE.PointsMaterial({
                color: 0xFFFFFF,
                size: 20
            });

        // now create the individual particles
        for (var p = 0; p < particleCount; p++) {

            // create a particle with random
            // position values, -250 -> 250
            var pX = Math.random() * 50000 - 25000,
                pY = Math.random() * 50000 - 25000,
                pZ = Math.random() * 50000 - 25000,
                particle = new THREE.Vector3(pX, pY, pZ);

            // add it to the geometry
            particles.vertices.push(particle);
        }

        // create the particle system
        var particleSystem = new THREE.ParticleSystem(
            particles,
            pMaterial);

        // add it to the scene
        scene.add(particleSystem);

        //renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // add renderer
        container.appendChild(renderer.domElement);

        // stats
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);

        // addEventListener
        document.addEventListener('mousemove', onMouseMove, false);
        // stage resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize(e) {
        windowHalfX = window.innerWidth * 0.5,
            windowHalfY = window.innerHeight * 0.5,

            camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX - windowHalfX) * 10;
        mouseY = (e.clientY - windowHalfY) * 10;
    }

    function render() {
        console.log("asd");
        requestAnimationFrame(render);
        camera.position.x += (mouseX - camera.position.x) * .02;
        camera.position.y += (-mouseY - camera.position.y) * .02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        stats.update();
    }
}