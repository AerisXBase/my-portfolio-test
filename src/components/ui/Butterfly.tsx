"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";

type GLTFWithAnimations = GLTF & { animations: THREE.AnimationClip[] };

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
      ref.current.position.x += delta * 0.5; // slower speed
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={0.6}
      position-x={-5}
      rotation={[0, Math.PI, 0]} // face model front-on
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
          width={200}
          height={200}
          alt="butterfly"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[999]">
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
