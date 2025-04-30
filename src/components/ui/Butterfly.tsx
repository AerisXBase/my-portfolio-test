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

  useEffect(() => {
    console.log("GLTF Model:", gltf);
    console.log("Animations:", gltf.animations);
    const [firstAction] = Object.values(actions);
    if (firstAction) {
      firstAction.play();
    } else {
      console.log("No animations found in the model.");
    }
  }, [actions, gltf.animations, gltf]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      // Fly from x=-8 to x=8 in ~8 seconds (16 units / 2 units per second)
      const currentX = groupRef.current.position.x;
      const newX = Math.min(currentX + delta * 2.0, 8);
      groupRef.current.position.x = newX;
      // Dynamic up-and-down motion like a falcon
      groupRef.current.position.y = 0.5 + Math.sin(time * 1.5) * 0.5;
      // Slight tilt for natural flight
      groupRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-8, 0, 0]}>
      <primitive
        object={gltf.scene}
        scale={1.0}
        rotation={[0.4, -Math.PI / 2, 0]} // Tilt to show body, hide legs
      />
      <pointLight
        position={[0, 0.5, 0]}
        color="#88f"
        intensity={4}
        distance={6}
      />{" "}
      {/* Enhanced blue glow */}
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
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <ambientLight intensity={0.8} /> {/* Increased for brighter scene */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />{" "}
        {/* Brighter main light */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.9}
          color="#88f"
        />{" "}
        {/* Enhanced blue for magic */}
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
