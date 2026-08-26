import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Canvas3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.032);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 9);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 4. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.2, 25);
    cyanLight.position.set(6, 6, 4);
    scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x10b981, 2.2, 25);
    greenLight.position.set(-6, -6, 3);
    scene.add(greenLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2.0, 30);
    blueLight.position.set(0, 5, -5);
    scene.add(blueLight);

    // -------------------------------------------------------------------------
    // PARALLAX LAYER 1: Distant Background (Particles & Cyber Grid)
    // -------------------------------------------------------------------------
    const layer1Group = new THREE.Group();
    scene.add(layer1Group);

    // 3D Cyber Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x00f0ff, 0x10b981);
    gridHelper.position.set(0, -7, -4);
    gridHelper.rotation.x = 0.1;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.12;
    layer1Group.add(gridHelper);

    // Distant Particle Cloud
    const particleCount = isMobile ? 250 : 550;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const greenColor = new THREE.Color(0x10b981);
    const blueColor = new THREE.Color(0x3b82f6);
    const colorsList = [cyanColor, greenColor, blueColor];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 28;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 35;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;

      const col = colorsList[i % colorsList.length];
      colorArray[i * 3] = col.r;
      colorArray[i * 3 + 1] = col.g;
      colorArray[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.045 : 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    layer1Group.add(particleSystem);

    // -------------------------------------------------------------------------
    // PARALLAX LAYER 2: Mid-Ground (Orbits & Primary Polyhedrons)
    // -------------------------------------------------------------------------
    const layer2Group = new THREE.Group();
    scene.add(layer2Group);

    // Central Subtle Wireframe Icosahedron (positioned slightly behind text)
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.15,
      roughness: 0.3,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(4, 1, -1);
    layer2Group.add(icoMesh);

    // Orbiting Torus Knot Ring (Right Margin)
    const torusGeo = new THREE.TorusKnotGeometry(2.2, 0.08, 120, 24);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-4.5, -2, -2);
    layer2Group.add(torusMesh);

    // -------------------------------------------------------------------------
    // PARALLAX LAYER 3: Near Background (Floating Wireframe Accent Shapes)
    // -------------------------------------------------------------------------
    const layer3Group = new THREE.Group();
    scene.add(layer3Group);

    const shapeMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.2 }),
    ];

    const shapeGeometries = [
      new THREE.OctahedronGeometry(0.55),
      new THREE.DodecahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.6),
    ];

    const shapes: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number } }[] = [];
    const shapeCount = isMobile ? 6 : 12;

    for (let i = 0; i < shapeCount; i++) {
      const geo = shapeGeometries[i % shapeGeometries.length];
      const mat = shapeMaterials[i % shapeMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);

      // Position shapes strategically along the vertical height, kept to left/right margins
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (3.5 + Math.random() * 4);
      const y = (i / shapeCount) * -30 + 10;
      const z = (Math.random() - 0.5) * 6;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      layer3Group.add(mesh);
      shapes.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
      });
    }

    // -------------------------------------------------------------------------
    // Smooth Scroll State Management (Zero Mouse Dependency)
    // -------------------------------------------------------------------------
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // -------------------------------------------------------------------------
    // Animation Loop
    // -------------------------------------------------------------------------
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp (0.08 damping factor for silk-smooth motion)
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

      if (!prefersReducedMotion) {
        // Continuous slow rotations of mid-ground shapes
        icoMesh.rotation.x = elapsedTime * 0.08;
        icoMesh.rotation.y = elapsedTime * 0.12;

        torusMesh.rotation.x = elapsedTime * 0.06;
        torusMesh.rotation.z = elapsedTime * 0.09;

        // Floating accent shapes rotation
        shapes.forEach((s) => {
          s.mesh.rotation.x += s.rotSpeed.x;
          s.mesh.rotation.y += s.rotSpeed.y;
          s.mesh.rotation.z += s.rotSpeed.z;
        });

        // Slow particle cloud drift
        particleSystem.rotation.y = elapsedTime * 0.015;
      }

      // -----------------------------------------------------------------------
      // Multi-Layer Scroll Parallax Depth
      // Layer 1 (Far): moves at 0.2x speed
      // Layer 2 (Mid): moves at 0.5x speed
      // Layer 3 (Near): moves at 0.9x speed
      // Camera moves along Z & Y axis with smooth scroll
      // -----------------------------------------------------------------------
      const scrollYOffset = currentScrollProgress * 22;

      layer1Group.position.y = scrollYOffset * 0.18;
      gridHelper.rotation.z = currentScrollProgress * Math.PI * 0.15;

      layer2Group.position.y = scrollYOffset * 0.45;
      layer2Group.rotation.y = currentScrollProgress * Math.PI * 0.8;

      layer3Group.position.y = scrollYOffset * 0.85;

      // Subtle camera position shift based on scroll section landmarking
      camera.position.y = -currentScrollProgress * 1.5;
      camera.position.z = 9 - Math.sin(currentScrollProgress * Math.PI) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      // Resource Cleanup
      icoGeo.dispose();
      icoMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();

      shapeGeometries.forEach((g) => g.dispose());
      shapeMaterials.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
