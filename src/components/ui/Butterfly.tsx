"use client"; // enables client-side interactivity in Next.js (needed for useEffect, animations, etc.)

import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three"; // core 3D library
import { Canvas, useFrame } from "@react-three/fiber"; // react wrapper for Three.js
import { useGLTF, PerspectiveCamera } from "@react-three/drei"; // useful helpers for 3D work
import { GLTF } from "three-stdlib"; // TypeScript type for loading .glb files
import Image from "next/image"; // Next.js optimized image component

// Extend the GLTF type to include animations (even though you're not using them yet)
type GLTFWithAnimations = GLTF & { animations: THREE.AnimationClip[] };

// 3D Butterfly component
function ButterflyModel() {
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const ref = useRef<THREE.Group>(null);

  // This function is called on every animation frame (~60fps)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 3.0; // move the butterfly to the right
      if (ref.current.position.x > 5) ref.current.position.x = -5; // loop back when off-screen
    }
  });

  return (
    <primitive
      ref={ref} // attach the 3D model to this reference
      object={gltf.scene} // actual loaded model
      scale={0.6} // smaller size
      position={[-5, 0.2, 1]} // initial position in the scene
      rotation={[Math.PI / 2.3, 0.3, 0.2]} // angled slightly to show wings
    />
  );
}

// Main butterfly wrapper
export default function Butterfly() {
  const [webglSupported, setWebglSupported] = useState(true);

  // Detect if the browser supports WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) throw new Error(); // fallback if not supported
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // If no WebGL, show fallback image
  if (!webglSupported) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[999]">
        <Image
          src="/model/butterfly.png"
          alt="Butterfly fallback"
          width={200}
          height={200}
        />
      </div>
    );
  }

  // WebGL is supported: show the 3D canvas
  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[999] pointer-events-none">
      <Canvas className="w-full h-full">
        <PerspectiveCamera
          makeDefault
          position={[0, 4, 6]} // slightly above and behind
          fov={45} // field of view
          near={0.1}
          far={100}
        />
        {/* LIGHTING */}
        <hemisphereLight args={["white", "#222", 0.6]} />{" "}
        {/* soft general lighting */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          color="#88f"
        />{" "}
        {/* blue highlight */}
        <directionalLight
          position={[-5, 10, -5]}
          intensity={0.5}
          color="#f8f"
        />{" "}
        {/* purple backlight */}
        <ambientLight intensity={0.3} /> {/* general fill light */}
        {/* Show butterfly once the model is ready */}
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
