"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import { GLTF } from "three-stdlib";
import Image from "next/image";

type GLTFWithAnimations = GLTF & { animations: THREE.AnimationClip[] };

function ButterflyModel() {
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const ref = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, ref);

  useEffect(() => {
    const [first] = Object.values(actions);
    // reduce flap amplitude and slightly speed up wing flaps
    first?.setEffectiveWeight(0.7);
    first?.setEffectiveTimeScale(1.2);
    first?.play();
  }, [actions]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 3.0; // faster horizontal speed
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={0.6}
      position={[-5, 0, 0]}
      rotation={[Math.PI / 2.5, 0.2, 0.1]} // tilt on z-axis, slight yaw
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
      <Canvas className="w-full h-full">
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 5]} // camera up and back
          fov={45}
          near={0.1}
          far={100}
        />
        {/* colored lights for effect */}
        <ambientLight intensity={0.8} />
        <pointLight position={[-10, 5, 10]} intensity={1} color="hotpink" />
        <pointLight position={[10, 5, -10]} intensity={0.5} color="cyan" />
        <Suspense fallback={null}>
          <ButterflyModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
