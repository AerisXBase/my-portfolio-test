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
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const { actions } = useAnimations(gltf.animations, groupRef);

  // Play the first animation if available
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

  // Animate the butterfly: fly left to right once with gentle flapping
  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.position.x += delta * 1.5; // Speed to cross in ~8 seconds
      groupRef.current.position.y = Math.sin(time * 2) * 0.3; // Smooth flapping
    }
  });

  return (
    <group ref={groupRef} position={[-6, 0, 0]}>
      <primitive
        object={gltf.scene}
        scale={1.0}
        rotation={[0, Math.PI / 2 + 0.3, 0]} // Faces right with back slightly visible
      />
      {/* Magical point light for glowing effect */}
      <pointLight
        position={[0, 0.5, 0]}
        color="#88f"
        intensity={1}
        distance={5}
      />
    </group>
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
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />{" "}
        {/* Zoomed out */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          color="#ffffff"
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.7} color="#88f" />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
