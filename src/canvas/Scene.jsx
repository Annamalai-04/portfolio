import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import Laptop3D from "./Laptop3D";
function Particles() {
  const p = useMemo(() => {
    let seed = 42;
    return Float32Array.from({ length: 150 }, () => {
      seed = (seed * 16807) % 2147483647;
      return (seed / 2147483647 - 0.5) * 14;
    });
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[p, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#63cfc7" transparent opacity={0.65} />
    </points>
  );
}
export default function Scene() {
  const reduced = useReducedMotion();
  const [mobile] = useState(
    () =>
      window.matchMedia(
        "(hover: none) and (pointer: coarse), (max-width: 600px)",
      ).matches,
  );
  const host = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const still = reduced || mobile;
  return (
    <div ref={host} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={mobile ? 1 : [1, 1.5]}
        camera={{ position: [0, 3.1, 7.9], fov: 39 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        frameloop={!visible ? "never" : still ? "demand" : "always"}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 5, 4]} intensity={3} color="#a7d8ff" />
        <pointLight position={[-4, 2, 1]} intensity={18} color="#5eead4" />
        <pointLight position={[3, -1, 1]} intensity={12} color="#9174ef" />
        <group position={[0, -0.55, 0]}>
          <group scale={0.78}>
            <Laptop3D reduced={still} />
          </group>
          <Float
            speed={still ? 0 : 1.2}
            rotationIntensity={still ? 0 : 0.2}
            floatIntensity={still ? 0 : 0.4}
          >
            <mesh position={[2.8, 1.7, -1]} rotation={[0.4, 0.3, 0.2]}>
              <icosahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial color="#76dfd0" wireframe />
            </mesh>
            <mesh position={[-2.7, -0.6, 0]} rotation={[0.4, 0.2, 0.7]}>
              <torusGeometry args={[0.25, 0.07, 8, 30]} />
              <meshStandardMaterial
                color="#9787e5"
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
          </Float>
        </group>
        {!mobile && <Particles />}
      </Canvas>
    </div>
  );
}
