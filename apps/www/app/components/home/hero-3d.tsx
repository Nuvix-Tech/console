import { useEffect, useRef } from "react";

export const HeroThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let cleanup = () => undefined;

    const setup = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const THREE = await import("three");
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      const geometry = new THREE.TorusKnotGeometry(1.4, 0.42, 220, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#7c6dff"),
        metalness: 0.65,
        roughness: 0.2,
        emissive: new THREE.Color("#2a145a"),
        emissiveIntensity: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      const keyLight = new THREE.DirectionalLight(0x9b8cff, 1.4);
      keyLight.position.set(4, 4, 6);
      const fillLight = new THREE.DirectionalLight(0x4fe2ff, 0.9);
      fillLight.position.set(-6, -2, 4);
      scene.add(ambient, keyLight, fillLight);

      const resize = () => {
        if (!canvas.parentElement) return;
        const { clientWidth, clientHeight } = canvas.parentElement;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(clientHeight, 1);
        camera.updateProjectionMatrix();
      };

      resize();
      window.addEventListener("resize", resize);

      const animate = () => {
        animationFrame = window.requestAnimationFrame(animate);
        mesh.rotation.x += 0.004;
        mesh.rotation.y += 0.006;
        mesh.rotation.z += 0.002;
        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(animationFrame);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    void setup();

    return () => cleanup();
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};
