"use client";

import { Reflector, Text, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { WORKS, type Work } from "../const";

export const BackgroundAnimation: React.FC = () => {
  const searchParams = useSearchParams();
  const work = searchParams.get("work");
  const selectedWork = useMemo(() => WORKS.find((w) => w.title === work), [work]) ?? WORKS[0];

  return (
    <div className="h-screen w-full -z-10 fixed top-0 left-0">
      <Canvas gl={{ alpha: false }} dpr={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 15 }}>
        <color attach="background" args={["black"]} />
        <fog attach="fog" args={["black", 15, 20]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Carla rotation={[0, Math.PI - 0.4, 0]} position={[-1.2, 0, 0.6]} scale={[0.26, 0.26, 0.26]} />
            <BackgroundText
              position={[0, 1.3, -2]}
              text={selectedWork?.videoText ?? "Select a work"}
              background={selectedWork?.background ?? ""}
              type={selectedWork?.type ?? "image"}
            />
            <Ground />
          </group>
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <directionalLight position={[-50, 0, -40]} intensity={0.7} />
          <Intro />
        </Suspense>
      </Canvas>
    </div>
  );
};

function Carla(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/carla-draco.glb");
  return <primitive object={scene} {...props} />;
}

function VideoText({
  position,
  text,
  background: backgroundSrc,
}: { position: [number, number, number]; text: string; background: string }) {
  const video = useMemo(() => {
    const video = Object.assign(document.createElement("video"), {
      src: backgroundSrc,
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    });
    void video.play();
    return video;
  }, [backgroundSrc]);
  return (
    <Text font="/Inter-Bold.woff" fontSize={1} position={position} lineHeight={0.8}>
      {text}
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </Text>
  );
}

function ImageText({
  position,
  text,
  background: backgroundSrc,
}: { position: [number, number, number]; text: string; background: string }) {
  const texture = useTexture(backgroundSrc);
  return (
    <Text font="/Inter-Bold.woff" fontSize={1} position={position} lineHeight={0.8}>
      {text}
      <meshBasicMaterial toneMapped={false} map={texture} />
    </Text>
  );
}

function BackgroundText({
  position,
  text,
  background,
  type,
}: {
  position: [number, number, number];
  text: string;
  background: string;
  type: Work["type"];
}) {
  if (type === "video") {
    return <VideoText position={position} text={text} background={background} />;
  }
  return <ImageText position={position} text={text} background={background} />;
}

function Ground() {
  const [floor, normal] = useTexture([
    "/SurfaceImperfections003_1K_var1.jpg",
    "/SurfaceImperfections003_1K_Normal.jpg",
  ]);
  return (
    <Reflector
      blur={[400, 100]}
      resolution={512}
      args={[10, 10]}
      mirror={0.5}
      mixBlur={6}
      mixStrength={1.5}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
    >
      {(Material, props) => (
        <Material
          color="#a0a0a0"
          metalness={0.4}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={new THREE.Vector2(2, 2)}
          {...props}
        />
      )}
    </Reflector>
  );
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}
