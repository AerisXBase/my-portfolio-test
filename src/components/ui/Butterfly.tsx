// src/components/ui/Butterfly.tsx
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";

type GLTFWithAnimations = GLTF & {
  animations: THREE.AnimationClip[];
};

function ButterflyModel() {
  const ref = useRef<THREE.Group>(null);
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const { actions } = useAnimations(gltf.animations, ref);

  // Play first animation
  useEffect(() => {
    const [firstAction] = Object.values(actions);
    firstAction?.play();
  }, [actions]);

  // Animate butterfly movement
  useFrame(({ clock }, delta) => {
    if (ref.current) {
      const time = clock.getElapsedTime();
      ref.current.position.x += delta * 2.0;
      ref.current.position.y = Math.sin(time * 2) * 0.3; // graceful up/down
      if (ref.current.position.x > 6) ref.current.position.x = -6;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={0.6}
      position={[-6, 0.2, 1]}
      rotation={[Math.PI / 2.3, 0.3, 0.15]} // slight tilt for elegance
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
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3.5, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          color="#fff8f8"
        />
        <directionalLight position={[-5, 8, -5]} intensity={0.5} color="#88f" />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
