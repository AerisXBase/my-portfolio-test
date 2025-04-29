"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

// Extend GLTF type to include animations
type GLTFWithAnimations = GLTF & {
  animations: THREE.AnimationClip[];
};

function ButterflyModel() {
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const ref = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, ref);

  // Play the first animation (e.g., wing flap) on mount
  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    firstAction?.play();
  }, [actions]);

  // Move the butterfly from left to right in a loop
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 1.5; // speed adjust
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <primitive ref={ref} object={gltf.scene} scale={0.5} position-x={-5} />
  );
}

export default function Butterfly() {
  const [webglSupported, setWebglSupported] = useState(true);

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) throw new Error("WebGL not supported");
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Fallback for unsupported devices
  if (!webglSupported) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[999]">
        <p className="text-white">3D not supported</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[999]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
