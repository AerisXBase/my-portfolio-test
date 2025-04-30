"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";
import { Particles } from "./Particles";

type GLTFWithAnimations = GLTF & {
  animations: THREE.AnimationClip[];
};

function ButterflyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const { actions } = useAnimations(gltf.animations, groupRef);
  const firstActionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    console.log("GLTF Model:", gltf);
    console.log("Animations:", gltf.animations);
    const [firstAction] = Object.values(actions);
    if (firstAction) {
      firstActionRef.current = firstAction;
      firstAction.setEffectiveTimeScale(1.5); // Faster wing flapping
      firstAction.paused = true; // Start paused
      firstAction.play();
    } else {
      console.log("No animations found in the model.");
    }
  }, [actions, gltf.animations, gltf]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const currentX = groupRef.current.position.x;
      const newX = Math.min(currentX + delta * 3.2, 8); // 16 units in ~5 seconds
      groupRef.current.position.x = newX;

      // Animation phases
      if (time < 1) {
        // Phase 1: Low flight, no flapping
        groupRef.current.position.y = 0.5;
      } else if (time < 2) {
        // Phase 2: Takeoff with flapping
        if (firstActionRef.current && firstActionRef.current.paused) {
          firstActionRef.current.paused = false; // Start flapping
        }
        groupRef.current.position.y = 0.5 + (time - 1) * 2; // Rise to y=2.5
      } else {
        // Phase 3: Natural glide with gentle flapping
        groupRef.current.position.y = 2.5 + Math.sin(time * 1.5) * 0.3;
        if (firstActionRef.current) {
          firstActionRef.current.setEffectiveTimeScale(1.0); // Normal flapping
        }
      }

      groupRef.current.rotation.z = Math.sin(time * 2) * 0.1; // Slight tilt
    }
  });

  return (
    <group ref={groupRef} position={[-8, 0, 0]}>
      <primitive
        object={gltf.scene}
        scale={1.0}
        rotation={[0.7, -Math.PI / 2, 0]} // Tilt to show back and wings
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
    <div className="fixed inset-0 bg-black z-[999] pointer-events-none">
      <Particles
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
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
