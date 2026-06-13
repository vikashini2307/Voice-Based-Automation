import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoomLampProps {
  isOn: boolean;
  position: [number, number, number];
}

export function RoomLamp({ isOn, position }: RoomLampProps) {
  const bulbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const intensityRef = useRef(0);

  useFrame((_, delta) => {
    const target = isOn ? 1 : 0;
    intensityRef.current += (target - intensityRef.current) * delta * 4;

    if (bulbRef.current) {
      const mat = bulbRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensityRef.current * 2.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + intensityRef.current * 0.3);
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = intensityRef.current * 0.18;
    }
  });

  return (
    <group position={position}>
      {/* Ceiling mounting plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#ccc" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cord */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>

      {/* Lamp shade */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <coneGeometry args={[0.28, 0.28, 16, 1, true]} />
        <meshStandardMaterial
          color="#d4c08a"
          side={THREE.DoubleSide}
          roughness={0.7}
          metalness={0.0}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Shade top ring */}
      <mesh position={[0, -0.38, 0]}>
        <torusGeometry args={[0.06, 0.008, 8, 24]} />
        <meshStandardMaterial color="#bba060" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Shade bottom ring */}
      <mesh position={[0, -0.63, 0]}>
        <torusGeometry args={[0.28, 0.008, 8, 32]} />
        <meshStandardMaterial color="#bba060" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Bulb */}
      <mesh ref={bulbRef} position={[0, -0.48, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color="#fff9e0"
          emissive="#ffdd88"
          emissiveIntensity={0}
          roughness={0.1}
          metalness={0}
        />
      </mesh>

      {/* Soft glow sphere (fake volumetric) */}
      <mesh ref={glowRef} position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color="#fff3b0"
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
