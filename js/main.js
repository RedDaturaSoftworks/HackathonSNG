window.onload = function() {
    // detector
    // main
    var container;
    var stats;
    var mouseX, mouseY;
    var camera, scene, renderer, light, sunLight;
    var controls;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth * 0.5;
    var windowHalfY = window.innerHeight * 0.5;

    var clock = new THREE.Clock();

    init();
    render();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.set(0, 500, 1000);    

        controls = new THREE.FlyControls( camera );
        controls.movementSpeed = 1000;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;

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
        skybox.material.opacity = 0.7;
        scene.add(skybox);


        // create the particle variables
        var particleCount = 18000;
        var particles = new THREE.Geometry();
        var pMaterial = new THREE.PointsMaterial({color: 0xFFFFFF, size: 20});

        for (var p = 0; p < particleCount; p++) {
            var pX = Math.random() * 50000 - 25000;
            var pY = Math.pow(Math.random(), 2) * 50000 - 25000;
            var pZ = Math.random() * 50000 - 25000;
            
            particles.vertices.push(new THREE.Vector3(pX, pY, pZ));
        }

        var particleSystem = new THREE.ParticleSystem(particles, pMaterial);

        // add it to the scene
        //scene.add(particleSystem);
        //camera.lookAt(scene.position);
        scene.add(camera);

        scene.add(new THREE.AmbientLight(0x404040));

        //renderer
        renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
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
        window.addEventListener('DOMMouseScroll', mousewheel, false);
        window.addEventListener('mousewheel', mousewheel, false);
    }

    function onWindowResize(e) {
        windowHalfX = window.innerWidth * 0.5;
        windowHalfY = window.innerHeight * 0.5;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX - windowHalfX) * 10;
        mouseY = (e.clientY - windowHalfY) * 10;
    }

    function mousewheel( event )
    {
        var e = window.event || event;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
        camera.fov += delta;
        camera.updateProjectionMatrix();
    }

    function render() {
        var delta = clock.getDelta();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        stats.update();
        controls.update( delta );
    }
}