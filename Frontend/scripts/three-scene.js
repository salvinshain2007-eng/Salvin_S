// ─────────────────────────────────────────────────────────────────────────────
//  three-scene.js — 3D Football Scene with Three.js
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // ── Scene Setup ─────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  
  const isMobile = window.innerWidth < 768;
  
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ── Lighting ────────────────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xd4af37, 3, 20);
  goldLight.position.set(3, 4, 3);
  scene.add(goldLight);

  const greenLight = new THREE.PointLight(0x00ff88, 1.5, 15);
  greenLight.position.set(-4, -2, 2);
  scene.add(greenLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(-3, 3, -3);
  scene.add(rimLight);

  // ── Football Geometry ──────────────────────────────────────────────────────
  // Classic football using icosahedron as base
  const footballGroup = new THREE.Group();

  // Main ball
  const ballGeo = new THREE.SphereGeometry(1.5, 64, 64);

  // Create football texture programmatically using canvas
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 1024;
  texCanvas.height = 512;
  const ctx = texCanvas.getContext('2d');

  // Base white color
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 1024, 512);

  // Draw pentagon/hexagon pattern
  function drawPolygon(cx, cy, radius, sides, color) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Black pentagons
  const positions = [
    [512, 256], [200, 100], [820, 100],
    [200, 420], [820, 420], [512, 50],
    [100, 256], [920, 256], [512, 460],
    [350, 180], [680, 180], [350, 336], [680, 336]
  ];
  positions.forEach(([x, y]) => drawPolygon(x, y, 65, 5, '#111111'));

  // Subtle seam lines
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 256); ctx.lineTo(1024, 256);
  ctx.moveTo(512, 0); ctx.lineTo(512, 512);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(texCanvas);

  const ballMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.35,
    metalness: 0.05,
    envMapIntensity: 0.5,
  });

  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.castShadow = true;
  footballGroup.add(ball);

  // Gold ring effect (subtle)
  const ringGeo = new THREE.TorusGeometry(1.8, 0.04, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.4
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  footballGroup.add(ring);

  // Glow sphere (backface)
  const glowGeo = new THREE.SphereGeometry(1.65, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  footballGroup.add(glow);

  scene.add(footballGroup);
  footballGroup.position.set(0, 0, 0);

  // ── Floating Particles ──────────────────────────────────────────────────────
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = isMobile ? 50 : 200;
  const positions_p = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions_p[i] = (Math.random() - 0.5) * 20;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions_p, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.04,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ── Scroll Interaction ──────────────────────────────────────────────────────
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    targetScrollProgress = window.scrollY / maxScroll;
  });

  // ── Mouse Interaction ───────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize Handler ──────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ── Animation Loop ──────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth scroll progress
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;

    // Rotate football
    footballGroup.rotation.y = elapsed * 0.4 + scrollProgress * Math.PI * 2;
    footballGroup.rotation.x = scrollProgress * Math.PI * 0.5 + Math.sin(elapsed * 0.3) * 0.1;

    // Subtle mouse tilt
    footballGroup.rotation.y += mouseX * 0.02;
    footballGroup.rotation.x += mouseY * 0.01;

    // Float up/down
    footballGroup.position.y = Math.sin(elapsed * 0.6) * 0.15;

    // Scroll: move ball slightly down and scale
    footballGroup.position.y -= scrollProgress * 1.5;
    const scaleVal = 1 - scrollProgress * 0.3;
    footballGroup.scale.set(scaleVal, scaleVal, scaleVal);

    // Animate ring
    ring.rotation.z = elapsed * 0.5;
    ring.material.opacity = 0.4 + Math.sin(elapsed * 1.5) * 0.15;

    // Animate glow
    glow.material.opacity = 0.06 + Math.sin(elapsed * 2) * 0.04;

    // Pulse gold light
    goldLight.intensity = 3 + Math.sin(elapsed * 1.2) * 0.8;

    // Rotate particles slowly
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = elapsed * 0.01;

    renderer.render(scene, camera);
  }

  animate();
})();
