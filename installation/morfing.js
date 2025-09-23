const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x000000);
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const count = 200;
    const radius = 1;
    const initialPositions = [];
    for (let i = 0; i < count; i++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        const x1 = radius * Math.cos(angle1);
        const y1 = radius * Math.sin(angle1);
        const z1 = Math.sin(angle1 * 5);
        const x2 = radius * Math.cos(angle2);
        const y2 = radius * Math.sin(angle2);
        const z2 = Math.sin(angle2 * 5);
        initialPositions.push(x1, y1, z1, x2, y2, z2);
        positions.push(x1, y1, z1, x2, y2, z2);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8A2BE2 });
    const lineSegments = new THREE.LineSegments(geometry, lineMaterial);
    scene.add(lineSegments);
    camera.position.z = 5;
    let morphing = false;
    let progress = 0;
    function animate() {
        requestAnimationFrame(animate);
        lineSegments.rotation.x += 0.01;
        lineSegments.rotation.y += 0.01;
        const positionAttribute = lineSegments.geometry.attributes.position.array;
        if (morphing) {
            progress += 0.01; 
            if (progress >= 1) {
                progress = 1;
                morphing = !morphing;
            }
            for (let i = 0; i < positionAttribute.length; i += 6) {
                const t = morphing ? Math.sin(progress * Math.PI / 2) : 1 - Math.sin(progress * Math.PI / 2);
                const angle = (i / 6) * 0.1;
                const x1 = initialPositions[i];
                const y1 = initialPositions[i + 1];
                const z1 = morphing ? Math.sin(angle * 5) * t : initialPositions[i + 2];
                const x2 = initialPositions[i + 3];
                const y2 = initialPositions[i + 4];
                const z2 = morphing ? Math.sin(angle * 5) * t : initialPositions[i + 5];
                positionAttribute[i + 2] = z1;
                positionAttribute[i + 5] = z2;
            }
        } else {
            if (performance.now() % 2000 < 100) {
                morphing = true;
                progress = 0;
            }
        }
        lineSegments.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });