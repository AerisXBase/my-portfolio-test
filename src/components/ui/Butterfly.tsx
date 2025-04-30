"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";
import { Particles } from "./Particles"; // Import your Particles component

type GLTFWithAnimations = GLTF & {
  animations: THREE.AnimationClip[];
};

function ButterflyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const { actions } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    console.log("GLTF Model:", gltf);
    console.log("Animations:", gltf.animations);
    const [firstAction] = Object.values(actions);
    if (firstAction) {
      firstAction.setEffectiveTimeScale(1.5); // Faster wing flapping
      firstAction.play();
    } else {
      console.log("No animations found in the model.");
    }
  }, [actions, gltf.animations, gltf]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const currentX = groupRef.current.position.x;
      const newX = Math.min(currentX + delta * 0.5, 8);
      groupRef.current.position.x = newX;
      groupRef.current.position.y = 0.5 + Math.sin(time * 1) * 0.5;
      groupRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-8, 0, 0]}>
      <primitive
        object={gltf.scene}
        scale={1.0}
        rotation={[0.2, -Math.PI / 2, 0]}
        castShadow
      />
      <pointLight
        position={[0, 0.5, 0]}
        color="#88f"
        intensity={4}
        distance={6}
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
      <div className="fixed inset-0 flex items-center justify-center z-[999]">
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
    <div className="fixed inset-0 z-[999] bg-black pointer-events-none">
      <Particles /> {/* Particle background */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.9} color="#88f" />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
