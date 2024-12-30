"use client";

import {
  Cloud,
  Clouds,
  Environment,
  Float,
  MeshWobbleMaterial,
  MotionPathControls,
  useMotion,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { DotScreen, EffectComposer, HueSaturation, TiltShift2 } from "@react-three/postprocessing";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { Circle } from "./curves";

export const BackgroundAnimation: React.FC = () => {
  const poi = useRef<THREE.Mesh>(new THREE.Mesh());
  const float = true;
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
      <Canvas camera={{ position: [10, 15, -10], fov: 45 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <MotionPathControls focus={poi} damping={0.2} focusDamping={0.15}>
          <Circle />
          <Loop />
        </MotionPathControls>
        <Float floatIntensity={20} rotationIntensity={25} speed={float ? 4 : 0}>
          <Sticker position={[1, 0, 1]} scale={2} ref={poi} />
        </Float>
        <Environment preset="city" background blur={0.5} />
        <Clouds>
          <Cloud
            concentrate="outside"
            seed={1}
            segments={100}
            bounds={20}
            volume={20}
            growth={10}
            opacity={0.15}
            position={[0, 0, -10]}
            speed={1}
          />
        </Clouds>
        <EffectComposer multisampling={4}>
          <HueSaturation saturation={-1} />
          <TiltShift2 blur={0.5} />
          <DotScreen scale={2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

type LoopProps = {
  factor?: number;
};

const Loop: React.FC<LoopProps> = ({ factor = 0.2 }) => {
  const motion = useMotion();
  useFrame((_state, delta) => {
    motion.current += Math.min(0.1, delta) * factor;
  });
  return null;
};

type StickerProps = {
  position?: [number, number, number];
  scale?: number;
};

const Sticker = forwardRef<THREE.Mesh, StickerProps>(({ position, scale, ...props }, ref) => {
  const [smiley, invert] = useTexture(["/frog_circle.png", "/frog_circle.png"]);
  return (
    <mesh ref={ref} position={position} scale={scale} {...props}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshWobbleMaterial
        factor={4}
        speed={2}
        depthTest={false}
        transparent
        map={smiley}
        map-flipY={false}
        roughness={1}
        roughnessMap={invert}
        roughnessMap-flipY={false}
        map-anisotropy={16}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});
