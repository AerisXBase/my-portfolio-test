"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";

type GLTFResult = GLTF & {
  nodes: unknown;
  materials: unknown;
};

function ButterFlyModel() {
  const { scene } = useGLTF("/model/butterfly.glb") as GLTFResult;
  return <primitive object={scene} scale={0.5} />;
}

useGLTF.preload("/model/butterfly.glb");

export default function Butterfly() {
  const [webglSupported, setWebglSupported] = useState(true);

  // Check if WebGL is supported
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
    // fallback for unsupported devices (like your laptop)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <Image
          src="/model/butterfly.png"
          alt="Butterfly fallback"
          className="w-64 h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen md:block hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <ButterFlyModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
