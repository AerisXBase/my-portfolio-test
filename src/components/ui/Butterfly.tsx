import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { PerspectiveCamera, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface GLTFWithAnimations extends THREE.GLTF {
  animations: THREE.AnimationClip[];
}

function ButterflyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/model/butterfly.glb") as GLTFWithAnimations;
  const { actions } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    const [firstAction] = Object.values(actions);
    if (firstAction) {
      firstAction.play();
    } else {
      console.log("No animations found in the model.");
    }
  }, [actions]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const currentX = groupRef.current.position.x;
      const newX = Math.min(currentX + delta * 1.8, 6);
      groupRef.current.position.x = newX;
      groupRef.current.position.y = Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[-6, 0, 0]}>
      <primitive
        object={gltf.scene}
        scale={1.0}
        rotation={[0.2, -Math.PI / 2, 0]}
      />
      <pointLight
        position={[0, 0.5, 0]}
        color="#88f"
        intensity={3}
        distance={5}
      />
      <pointLight
        position={[0, -0.5, 0]}
        color="#ff0"
        intensity={2}
        distance={5}
      />
    </group>
  );
}

export default function Butterfly() {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[999] pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
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
