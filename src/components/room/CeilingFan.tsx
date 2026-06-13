import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CeilingFanProps {
  isOn: boolean;
  position: [number, number, number];
}

export function CeilingFan({ isOn, position }: CeilingFanProps) {
  const bladeGroupRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0);
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (!bladeGroupRef.current) return;
    const targetSpeed = isOn ? Math.PI * 8 : 0;
    const accel = isOn ? 3 : 5;
    speedRef.current += (targetSpeed - speedRef.current) * delta * accel;
    angleRef.current += speedRef.current * delta;
    bladeGroupRef.current.rotation.y = angleRef.current;
  });

  return (
    // position[1] is ceiling Y=4. Fan hangs DOWN from ceiling with a rod.
    // Rod top at ceiling (y=0 relative), blades at y=-0.55 from position
    <group position={position}>
      {/* Ceiling canopy / mounting plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.06, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Drop rod — 0.6 units long, hanging down */}
      <mesh position={[0, -0.33, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Motor housing — sits at end of rod */}
      <mesh position={[0, -0.68, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.15, 0.22, 16]} />
        <meshStandardMaterial color="#999" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.57, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.06, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.06, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rotating blade assembly at motor level */}
      <group ref={bladeGroupRef} position={[0, -0.68, 0]}>
        {[0, 90, 180, 270].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={i} rotation={[0, rad, 0]}>
              {/* Metal bracket arm */}
              <mesh position={[0.24, 0, 0]} rotation={[0, 0, -0.08]} castShadow>
                <boxGeometry args={[0.28, 0.035, 0.04]} />
                <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Wooden blade — angled slightly for airflow */}
              <mesh position={[0.6, 0.025, 0]} rotation={[0.1, 0, 0]} castShadow>
                <boxGeometry args={[0.6, 0.012, 0.16]} />
                <meshStandardMaterial color="#9c7a2e" roughness={0.5} metalness={0.03} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Light kit below motor */}
      <mesh position={[0, -0.92, 0]} castShadow>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.2} />
      </mesh>
    </group>
  );
}
