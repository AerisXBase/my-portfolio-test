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

  // Check if the model and animations are loading, and play the animation
  useEffect(() => {
    console.log("GLTF Model:", gltf);
    console.log("Animations:", gltf.animations);
    const [firstAction] = Object.values(actions);
    if (firstAction) {
      firstAction.play();
    } else {
      console.log("No animations found in the model.");
    }
  }, [actions, gltf.animations]);

  // Simple animation: move left to right and flap up/down
  useFrame(({ clock }, delta) => {
    if (ref.current) {
      const time = clock.getElapsedTime();
      ref.current.position.x += delta * 2.0; // Move horizontally
      ref.current.position.y = Math.sin(time * 2) * 0.3; // Gentle up-down motion
      if (ref.current.position.x > 6) ref.current.position.x = -6; // Reset position
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={1.5} // Make it big enough to see clearly
      position={[-3, 1, 0]} // Start slightly left, centered in view
      rotation={[0, Math.PI / 4, 0]} // Slight angle to show the body
    />
  );
}

export default function Butterfly() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) throw new Error("WebGL not supported");
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
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />{" "}
        {/* Camera close enough to see */}
        <ambientLight intensity={0.5} /> {/* Soft base light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          color="#ffffff"
        />{" "}
        {/* Main light for brightness */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.7}
          color="#88f"
        />{" "}
        {/* Secondary light for a magical touch */}
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
        {/* Uncomment the line below if you want to explore the scene */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
