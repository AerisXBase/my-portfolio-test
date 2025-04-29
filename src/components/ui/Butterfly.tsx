"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";

type GLTFWithAnimations = GLTF & { animations: THREE.AnimationClip[] };

function ButterflyModel() {
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 3.0; // faster horizontal movement
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={0.6}
      position={[-5, 0.2, 1]}
      rotation={[Math.PI / 2.3, 0.3, 0.2]} // tilt to show wings and body
    />
  );
}

export default function Butterfly() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) throw new Error();
    } catch {
      setWebglSupported(false);
    }
  }, []);

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

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[999] pointer-events-none">
      <Canvas className="w-full h-full">
        <PerspectiveCamera
          makeDefault
          position={[0, 4, 6]}
          fov={45}
          near={0.1}
          far={100}
        />
        {/* Lighting for dramatic effect */}
        <hemisphereLight args={["white", "#222", 0.6]} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} color="#88f" />
        <directionalLight
          position={[-5, 10, -5]}
          intensity={0.5}
          color="#f8f"
        />
        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
