import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OutsideViewProps {
  doorOpen: boolean;
}

/**
 * A hallway/outdoor scene visible through the door opening when it's open.
 * Positioned just outside the left wall (x < -4).
 */
export function OutsideView({ doorOpen }: OutsideViewProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (lightRef.current) {
      // Gentle flicker of outdoor light
      lightRef.current.intensity += (doorOpen ? 6 : 0 - lightRef.current.intensity) * delta * 3;
    }
  });

  if (!doorOpen) return null;

  return (
    <group position={[-4.5, 0, 1.29]}>
      {/* Outdoor ambient point light shining through door */}
      <pointLight
        ref={lightRef}
        position={[0, 2.5, 0]}
        intensity={6}
        color="#c8e0ff"
        distance={5}
        decay={2}
      />

      {/* ── HALLWAY FLOOR ── */}
      <mesh position={[-1.2, -0.02, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.04, 2.8]} />
        <meshStandardMaterial color="#c8b89a" roughness={0.7} />
      </mesh>

      {/* ── HALLWAY CEILING ── */}
      <mesh position={[-1.2, 4.02, 0]}>
        <boxGeometry args={[2.5, 0.06, 2.8]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.9} />
      </mesh>

      {/* ── FAR WALL (end of hallway) ── */}
      <mesh position={[-2.5, 2, 0]}>
        <boxGeometry args={[0.1, 4.2, 2.8]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.85} />
      </mesh>

      {/* ── HALLWAY LEFT WALL ── */}
      <mesh position={[-1.2, 2, -1.4]}>
        <boxGeometry args={[2.5, 4.2, 0.08]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.85} />
      </mesh>

      {/* ── HALLWAY RIGHT WALL ── */}
      <mesh position={[-1.2, 2, 1.4]}>
        <boxGeometry args={[2.5, 4.2, 0.08]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.85} />
      </mesh>

      {/* Skirting */}
      <mesh position={[-1.2, 0.1, -1.36]}>
        <boxGeometry args={[2.5, 0.18, 0.04]} />
        <meshStandardMaterial color="#c0b08a" roughness={0.7} />
      </mesh>
      <mesh position={[-1.2, 0.1, 1.36]}>
        <boxGeometry args={[2.5, 0.18, 0.04]} />
        <meshStandardMaterial color="#c0b08a" roughness={0.7} />
      </mesh>

      {/* ── SMALL TABLE IN HALLWAY ── */}
      <mesh position={[-1.8, 0.42, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.06, 0.38]} />
        <meshStandardMaterial color="#6a4818" roughness={0.55} />
      </mesh>
      {/* Table legs */}
      {[[-0.22,-0.15],[-.22,0.15],[0.22,-0.15],[0.22,0.15]].map(([lx,lz],i) => (
        <mesh key={i} position={[-1.8+lx, 0.22, -0.9+lz]} castShadow>
          <boxGeometry args={[0.04, 0.42, 0.04]} />
          <meshStandardMaterial color="#4a2e08" roughness={0.7} />
        </mesh>
      ))}

      {/* Vase on hallway table */}
      <mesh position={[-1.8, 0.56, -0.9]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.2, 10]} />
        <meshStandardMaterial color="#5a8ab0" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Flower */}
      <mesh position={[-1.8, 0.75, -0.9]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d06080" roughness={0.9} />
      </mesh>

      {/* ── WALL ART in hallway ── */}
      <mesh position={[-2.44, 2.4, 0]} castShadow>
        <boxGeometry args={[0.06, 0.55, 0.7]} />
        <meshStandardMaterial color="#4a3010" roughness={0.6} />
      </mesh>
      <mesh position={[-2.41, 2.4, 0]}>
        <boxGeometry args={[0.01, 0.45, 0.6]} />
        <meshStandardMaterial color="#4060a0" roughness={0.2} emissive="#2040a0" emissiveIntensity={0.15} />
      </mesh>

      {/* ── CEILING LIGHT in hallway ── */}
      <mesh position={[-1.5, 3.9, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.2]} />
        <meshStandardMaterial
          color="#f5f0e0"
          emissive="#ffe080"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* ── DOOR MAT at threshold ── */}
      <mesh position={[-0.2, 0.003, 0.15]} receiveShadow>
        <boxGeometry args={[0.5, 0.015, 0.7]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.95} />
      </mesh>
      {/* Mat stripes */}
      {[-0.25,-0.1,0.05,0.2].map((mz,i) => (
        <mesh key={i} position={[-0.2, 0.009, 0.15+mz]}>
          <boxGeometry args={[0.48, 0.005, 0.03]} />
          <meshStandardMaterial color="#8a6040" roughness={0.9} />
        </mesh>
      ))}

      {/* ── COAT HOOKS on hallway wall ── */}
      {[-0.5, 0.3].map((hz, i) => (
        <group key={i} position={[-2.42, 1.8, hz]}>
          <mesh>
            <boxGeometry args={[0.06, 0.06, 0.04]} />
            <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.04, -0.06, 0.015]}>
            <cylinderGeometry args={[0.012, 0.008, 0.12, 8]} />
            <meshStandardMaterial color="#777" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Jacket hanging on hook */}
      <mesh position={[-2.35, 1.6, -0.5]} castShadow>
        <boxGeometry args={[0.04, 0.32, 0.22]} />
        <meshStandardMaterial color="#3a4a5a" roughness={0.85} />
      </mesh>

      {/* ── OUTDOOR GLOW (sky light at end of hall) ── */}
      <mesh position={[-2.44, 2.0, 0]}>
        <planeGeometry args={[3.8, 0.1]} />
        <meshStandardMaterial
          color="#a0c8ff"
          emissive="#80b0ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
