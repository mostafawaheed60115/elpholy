import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radio, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const SatelliteHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [satelliteName, setSatelliteName] = useState('نايل سات 301');
  const [signalStrength, setSignalStrength] = useState(99);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(isRotating);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 8.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Remove any previous child
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Group for entire assembly
    const mainGroup = new THREE.Group();
    mainGroup.position.y = 1.1;
    scene.add(mainGroup);

    // 1. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const orangeLight = new THREE.PointLight(0xF49013, 2.5, 15);
    orangeLight.position.set(-4, -2, 2);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x283793, 3.5, 20);
    blueLight.position.set(4, 3, -3);
    scene.add(blueLight);

    // 2. Parabolic Satellite Dish Geometry
    // Using LatheGeometry to create a true parabolic concave dish
    const points: THREE.Vector2[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const radius = t * 2.2;
      const depth = (radius * radius) * 0.16; // Parabolic curve z = a * r^2
      points.push(new THREE.Vector2(radius, depth));
    }

    const dishGeometry = new THREE.LatheGeometry(points, 48);
    // Dish Materials: front and back
    const dishMaterial = new THREE.MeshStandardMaterial({
      color: 0x25213B,
      metalness: 0.35,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const dishMesh = new THREE.Mesh(dishGeometry, dishMaterial);
    dishMesh.rotation.x = Math.PI / 2; // Face forward
    mainGroup.add(dishMesh);

    // Dish Outer Rim Lip
    const rimGeometry = new THREE.TorusGeometry(2.21, 0.05, 16, 64);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xF49013, // Brand carrot orange highlight
      metalness: 0.6,
      roughness: 0.2
    });
    const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
    rimMesh.position.z = points[points.length - 1].y;
    mainGroup.add(rimMesh);

    // Central Brand Logo Emblem inside dish center
    const centerPlateGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
    const centerPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x283793,
      metalness: 0.8,
      roughness: 0.2
    });
    const centerPlate = new THREE.Mesh(centerPlateGeometry, centerPlateMaterial);
    centerPlate.rotation.x = Math.PI / 2;
    centerPlate.position.z = 0.04;
    mainGroup.add(centerPlate);

    // 3. LNB Support Feed Arm
    const armGroup = new THREE.Group();
    mainGroup.add(armGroup);

    // Lower bracket arm extending from dish bottom
    const armCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -1.8, 0.6),
      new THREE.Vector3(0, -2.1, 1.8),
      new THREE.Vector3(0, -1.2, 2.7),
      new THREE.Vector3(0, 0, 2.6) // Pointing towards focal center
    );
    const armGeometry = new THREE.TubeGeometry(armCurve, 32, 0.045, 12, false);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d3957,
      metalness: 0.7,
      roughness: 0.3
    });
    const armMesh = new THREE.Mesh(armGeometry, armMaterial);
    armGroup.add(armMesh);

    // LNB Holder Collar
    const collarGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 24);
    const collarMaterial = new THREE.MeshStandardMaterial({
      color: 0x25213B,
      metalness: 0.5,
      roughness: 0.4
    });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.set(0, 0, 2.6);
    collar.rotation.x = Math.PI / 2;
    armGroup.add(collar);

    // LNB Feedhorn Cylinder (The Receiver Unit)
    const lnbGeometry = new THREE.CylinderGeometry(0.14, 0.16, 0.4, 24);
    const lnbMaterial = new THREE.MeshStandardMaterial({
      color: 0xF49013,
      metalness: 0.4,
      roughness: 0.25,
      emissive: 0xF49013,
      emissiveIntensity: 0.15
    });
    const lnbMesh = new THREE.Mesh(lnbGeometry, lnbMaterial);
    lnbMesh.position.set(0, 0, 2.45);
    lnbMesh.rotation.x = Math.PI / 2;
    armGroup.add(lnbMesh);

    // LNB Cap
    const lnbCapGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 24);
    const lnbCapMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.1
    });
    const lnbCap = new THREE.Mesh(lnbCapGeometry, lnbCapMaterial);
    lnbCap.position.set(0, 0, 2.23);
    lnbCap.rotation.x = Math.PI / 2;
    armGroup.add(lnbCap);

    // 4. Back Mount & Mast Pole
    const mountGroup = new THREE.Group();
    mainGroup.add(mountGroup);

    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.09, 0.09, 3.5, 24);
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a84a6,
      metalness: 0.85,
      roughness: 0.25
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, -1.8, -0.6);
    mountGroup.add(pole);

    // Bracket joint
    const bracketGeometry = new THREE.BoxGeometry(0.35, 0.4, 0.45);
    const bracketMaterial = new THREE.MeshStandardMaterial({
      color: 0x283793,
      metalness: 0.7,
      roughness: 0.3
    });
    const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket.position.set(0, -0.2, -0.4);
    mountGroup.add(bracket);

    // 5. Signal Wave Rings (Expanding from LNB towards user/satellite)
    const waveCount = 4;
    const waveRings: THREE.Mesh[] = [];
    const ringGeo = new THREE.RingGeometry(0.2, 0.25, 48);

    for (let i = 0; i < waveCount; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0, 2.7);
      ring.rotation.x = 0;
      mainGroup.add(ring);
      waveRings.push(ring);
    }

    // 6. Orbiting Micro Satellite
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Sat Body
    const satBodyGeo = new THREE.BoxGeometry(0.3, 0.2, 0.2);
    const satBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      metalness: 0.9,
      roughness: 0.1
    });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    // Solar Wings
    const wingGeo = new THREE.BoxGeometry(0.8, 0.25, 0.02);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.3
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.x = -0.55;
    satelliteGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.x = 0.55;
    satelliteGroup.add(rightWing);

    // 7. Floating Space Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const col1 = new THREE.Color(0xF49013);
    const col2 = new THREE.Color(0x283793);
    const col3 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      const c = i % 3 === 0 ? col1 : i % 3 === 1 ? col2 : col3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive Mouse Tracking
    let targetRotationX = 0.25;
    let targetRotationY = -0.4;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = -0.4 + mouseX * 0.6;
      targetRotationX = 0.25 - mouseY * 0.4;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Keep the renderer at the actual canvas size without rebuilding the scene.
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial Angle
    mainGroup.rotation.x = 0.25;
    mainGroup.rotation.y = -0.4;

    // Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Timer();
    clock.connect(document);
    let isInViewport = true;
    let isDocumentVisible = document.visibilityState === 'visible';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      if (!isInViewport || !isDocumentVisible) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      clock.update();
      const elapsedTime = clock.getElapsed();

      // Smooth dish rotation towards target with gentle breathing
      const idleSwayY = isRotatingRef.current && !prefersReducedMotion ? Math.sin(elapsedTime * 0.8) * 0.08 : 0;
      const idleSwayX = isRotatingRef.current && !prefersReducedMotion ? Math.cos(elapsedTime * 0.7) * 0.05 : 0;

      mainGroup.rotation.y += (targetRotationY + idleSwayY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX + idleSwayX - mainGroup.rotation.x) * 0.05;

      // Animate Signal Waves
      waveRings.forEach((ring, index) => {
        const offset = prefersReducedMotion ? index * 0.35 : (elapsedTime * 1.6 + (index * 0.5)) % 2;
        const scale = 1 + offset * 3.5;
        ring.scale.set(scale, scale, scale);
        ring.position.z = 2.6 + offset * 1.8;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, (1 - offset / 2) * 0.65);
      });

      // Orbiting Micro Satellite
      const satOrbitRadius = 4.8;
      const satAngle = prefersReducedMotion ? 0.8 : elapsedTime * 0.45;
      satelliteGroup.position.x = Math.cos(satAngle) * satOrbitRadius;
      satelliteGroup.position.y = 2.2 + Math.sin(satAngle * 1.5) * 0.8;
      satelliteGroup.position.z = Math.sin(satAngle) * satOrbitRadius - 1;
      satelliteGroup.rotation.y = -satAngle;

      // Slowly rotate space particles
      if (!prefersReducedMotion) {
        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = elapsedTime * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
      if (isInViewport && isDocumentVisible && !animationFrameId) animate();
    }, { rootMargin: '100px' });
    intersectionObserver.observe(container);
    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible';
      if (isDocumentVisible && isInViewport && !animationFrameId) animate();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clock.dispose();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      renderer.dispose();
      dishGeometry.dispose();
      dishMaterial.dispose();
      rimGeometry.dispose();
      rimMaterial.dispose();
      armGeometry.dispose();
      armMaterial.dispose();
      poleGeometry.dispose();
      poleMaterial.dispose();
    };
  }, []);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // Periodic signal meter micro fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(100, Math.max(97, prev + delta));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const switchSatellite = (name: string, strength: number) => {
    setSatelliteName(name);
    setSignalStrength(strength);
  };

  return (
    <div className="relative flex h-[270px] w-full items-center justify-center sm:h-[340px] lg:h-[400px]">
      {/* Three.js Canvas Container - with touch-action pan-y so vertical scrolling works freely on phones */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
        style={{ touchAction: 'pan-y' }}
        title="اسحب أو حرك الماوس لتدوير طبق الدش 3D ثلاثي الأبعاد"
      />

      {/* Floating 3D HUD Badges */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 bg-[#25213B]/90 backdrop-blur-md border border-white/10 text-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl flex items-center gap-2 sm:gap-3 pointer-events-none sm:pointer-events-auto">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#283793] text-[#F49013] shrink-0">
          <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#25213B]"></span>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-400">إشارة مستقرة</span>
            <span className="text-[10px] sm:text-xs bg-[#F49013] text-white px-1.5 py-0.5 rounded font-mono font-bold">{signalStrength}%</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
            <span>{satelliteName}</span>
          </div>
        </div>
      </div>

      {/* Satellite Switcher Pill */}
      <div className="absolute bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:right-4 z-10 bg-[#25213B]/95 backdrop-blur-md border border-white/10 text-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-xl flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2">
        <div className="hidden xs:flex items-center gap-1 text-[11px] sm:text-xs text-gray-300 font-medium px-1 sm:px-2">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F49013]" />
          <span>توجيه:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar shrink">
          <button
            onClick={() => switchSatellite('نايل سات 301', 99)}
            className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl transition whitespace-nowrap ${
              satelliteName.includes('نايل')
                ? 'bg-[#F49013] text-white shadow-xs font-bold'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            نايل سات 7°W
          </button>
          <button
            onClick={() => switchSatellite('هوتبيرد الأوروبي', 98)}
            className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl transition whitespace-nowrap ${
              satelliteName.includes('هوتبيرد')
                ? 'bg-[#F49013] text-white shadow-xs font-bold'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            هوتبيرد 13°E
          </button>
          <button
            onClick={() => switchSatellite('عرب سات / بدر', 97)}
            className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl transition whitespace-nowrap ${
              satelliteName.includes('عرب')
                ? 'bg-[#F49013] text-white shadow-xs font-bold'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            بدر 26°E
          </button>
        </div>
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'إيقاف الدوران التلقائي' : 'تشغيل الدوران التلقائي'}
          className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition shrink-0"
        >
          <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
        </button>
      </div>

      {/* Floating Interactive 3D Hint - hidden on mobile to avoid badge clutter */}
      <div className="hidden sm:flex absolute top-4 left-4 z-10 bg-[#283793]/80 backdrop-blur-md border border-white/15 text-white/90 text-xs px-3 py-1.5 rounded-full items-center gap-1.5 shadow-lg">
        <Eye className="w-3.5 h-3.5 text-[#F49013]" />
        <span>محاكاة طبق دش حقيقي 3D</span>
      </div>
    </div>
  );
};
