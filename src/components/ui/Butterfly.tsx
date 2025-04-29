"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFWithAnimations = GLTF & {
  animations: THREE.AnimationClip[];
};

function ButterflyModel() {
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const ref = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, ref);

  useEffect(() => {
    const [first] = Object.values(actions);
    first?.play();
  }, [actions]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 1.5;
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={0.5}
      position={[-5, 0, 0]}
      rotation={[Math.PI / 2.5, 0, 0]} // top-down angle
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
        <p className="text-white">3D not supported</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black dark:bg-black overflow-hidden z-[999] pointer-events-none">
      <Canvas className="w-full h-full">
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 0]} // looking from above
          fov={50}
          near={0.1}
          far={100}
        />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
