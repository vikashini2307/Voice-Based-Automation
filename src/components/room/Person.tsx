import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface PersonState {
  x: number;
  z: number;
  angle: number; // facing direction in radians
  sitting: boolean;
  walking: boolean;
}

interface PersonProps {
  personState: PersonState;
  isSpeaking: boolean;
}

// Sofa sit position (center front of sofa)
export const SOFA_SIT_X = 0.5;
export const SOFA_SIT_Z = -2.85;
export const SOFA_SIT_ANGLE = Math.PI; // facing away from viewer

export function Person({ personState, isSpeaking }: PersonProps) {
  const rootRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const upperBodyRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const mouthOpenRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const { x, z, angle, sitting, walking } = personState;

    // Smooth position update
    if (rootRef.current) {
      rootRef.current.position.x += (x - rootRef.current.position.x) * delta * 8;
      rootRef.current.position.z += (z - rootRef.current.position.z) * delta * 8;
      // Smooth rotation
      let da = angle - rootRef.current.rotation.y;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      rootRef.current.rotation.y += da * delta * 10;

      // Sitting: lower body, lean back
      const targetY = sitting ? -0.32 : 0;
      rootRef.current.position.y += (targetY - rootRef.current.position.y) * delta * 6;
    }

    // Mouth speaking animation
    if (mouthRef.current) {
      const target = isSpeaking ? Math.abs(Math.sin(t * 8)) * 0.045 + 0.005 : 0;
      mouthOpenRef.current += (target - mouthOpenRef.current) * delta * 12;
      mouthRef.current.scale.y = 1 + mouthOpenRef.current * 18;
    }

    // Leg walk animation
    const walkSwing = walking ? Math.sin(t * 7) * 0.42 : 0;
    const walkTarget = sitting ? 0 : walkSwing;

    if (leftLegRef.current) {
      const sitAngle = sitting ? -Math.PI / 2 : 0;
      leftLegRef.current.rotation.x += (sitAngle + (sitting ? 0 : -walkTarget) - leftLegRef.current.rotation.x) * delta * 10;
    }
    if (rightLegRef.current) {
      const sitAngle = sitting ? -Math.PI / 2 : 0;
      rightLegRef.current.rotation.x += (sitAngle + (sitting ? 0 : walkTarget) - rightLegRef.current.rotation.x) * delta * 10;
    }

    // Arm swing (opposite to legs)
    const armSwing = walking ? Math.sin(t * 7) * 0.3 : 0;
    if (leftArmRef.current) {
      const sitAngle = sitting ? -0.4 : 0;
      leftArmRef.current.rotation.x += (sitAngle + armSwing - leftArmRef.current.rotation.x) * delta * 10;
    }
    if (rightArmRef.current) {
      const sitAngle = sitting ? -0.4 : 0;
      rightArmRef.current.rotation.x += (sitAngle - armSwing - rightArmRef.current.rotation.x) * delta * 10;
    }

    // Upper body lean back when sitting
    if (upperBodyRef.current) {
      const leanTarget = sitting ? -0.28 : (walking ? Math.sin(t * 7) * 0.03 : 0);
      upperBodyRef.current.rotation.x += (leanTarget - upperBodyRef.current.rotation.x) * delta * 6;
    }
  });

  const skin = "#e8b48a";
  const shirt = "#1a4fa0";
  const pants = "#2c3e50";
  const shoes = "#1a1208";
  const hair = "#2c1a0a";
  const shirtDark = "#153a80";

  return (
    <group ref={rootRef} position={[personState.x, 0, personState.z]} rotation={[0, personState.angle, 0]}>

      {/* ── LEGS ── */}
      {/* Left leg group (pivots at hip) */}
      <group ref={leftLegRef} position={[-0.1, 0.68, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.13, 0.44, 0.15]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.5, 0.01]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.13]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.68, 0.055]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.24]} />
          <meshStandardMaterial color={shoes} roughness={0.45} metalness={0.1} />
        </mesh>
      </group>

      {/* Right leg group (pivots at hip) */}
      <group ref={rightLegRef} position={[0.1, 0.68, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.13, 0.44, 0.15]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.5, 0.01]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.13]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.68, 0.055]} castShadow>
          <boxGeometry args={[0.14, 0.09, 0.24]} />
          <meshStandardMaterial color={shoes} roughness={0.45} metalness={0.1} />
        </mesh>
      </group>

      {/* Belt */}
      <mesh position={[0, 0.69, 0]}>
        <boxGeometry args={[0.31, 0.07, 0.19]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.69, 0.1]}>
        <boxGeometry args={[0.06, 0.045, 0.01]} />
        <meshStandardMaterial color="#c8a020" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ── UPPER BODY GROUP (for sitting lean) ── */}
      <group ref={upperBodyRef} position={[0, 0.73, 0]}>

        {/* Torso */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.36, 0.62, 0.22]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
        {/* Shirt front panel */}
        <mesh position={[0, 0.32, 0.112]}>
          <boxGeometry args={[0.12, 0.5, 0.005]} />
          <meshStandardMaterial color={shirtDark} roughness={0.8} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.61, 0.085]}>
          <boxGeometry args={[0.2, 0.07, 0.05]} />
          <meshStandardMaterial color={shirtDark} roughness={0.75} />
        </mesh>

        {/* ── LEFT ARM ── */}
        <group ref={leftArmRef} position={[-0.24, 0.43, 0]}>
          <mesh position={[-0.04, 0.03, 0]} castShadow>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={shirt} roughness={0.8} />
          </mesh>
          <mesh position={[-0.09, -0.12, 0]} castShadow rotation={[0, 0, 0.18]}>
            <boxGeometry args={[0.12, 0.32, 0.13]} />
            <meshStandardMaterial color={shirt} roughness={0.8} />
          </mesh>
          <mesh position={[-0.12, -0.31, 0]} castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[-0.13, -0.47, 0.01]} castShadow rotation={[-0.08, 0, 0.1]}>
            <boxGeometry args={[0.1, 0.28, 0.11]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[-0.14, -0.65, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.12, 0.07]} />
            <meshStandardMaterial color={skin} roughness={0.65} />
          </mesh>
        </group>

        {/* ── RIGHT ARM ── */}
        <group ref={rightArmRef} position={[0.24, 0.43, 0]}>
          <mesh position={[0.04, 0.03, 0]} castShadow>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={shirt} roughness={0.8} />
          </mesh>
          <mesh position={[0.09, -0.12, 0]} castShadow rotation={[0, 0, -0.18]}>
            <boxGeometry args={[0.12, 0.32, 0.13]} />
            <meshStandardMaterial color={shirt} roughness={0.8} />
          </mesh>
          <mesh position={[0.12, -0.31, 0]} castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[0.13, -0.47, 0.01]} castShadow rotation={[-0.08, 0, -0.1]}>
            <boxGeometry args={[0.1, 0.28, 0.11]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[0.14, -0.65, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.12, 0.07]} />
            <meshStandardMaterial color={skin} roughness={0.65} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.69, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.075, 0.13, 10]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {/* ── HEAD ── */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.23]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.09, -0.005]} castShadow>
          <boxGeometry args={[0.25, 0.09, 0.24]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.99, -0.115]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.04]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        {/* Hair sides */}
        <mesh position={[-0.125, 1.0, 0]} castShadow>
          <boxGeometry args={[0.01, 0.14, 0.22]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        <mesh position={[0.125, 1.0, 0]} castShadow>
          <boxGeometry args={[0.01, 0.14, 0.22]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        {/* Eyebrows */}
        <mesh position={[-0.07, 0.97, 0.118]}>
          <boxGeometry args={[0.06, 0.018, 0.005]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        <mesh position={[0.07, 0.97, 0.118]}>
          <boxGeometry args={[0.06, 0.018, 0.005]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        {/* Eye whites */}
        <mesh position={[-0.07, 0.925, 0.117]}>
          <boxGeometry args={[0.055, 0.038, 0.006]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.2} />
        </mesh>
        <mesh position={[0.07, 0.925, 0.117]}>
          <boxGeometry args={[0.055, 0.038, 0.006]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.2} />
        </mesh>
        {/* Irises */}
        <mesh position={[-0.07, 0.925, 0.122]}>
          <boxGeometry args={[0.028, 0.028, 0.006]} />
          <meshStandardMaterial color="#3a6ea5" roughness={0.1} />
        </mesh>
        <mesh position={[0.07, 0.925, 0.122]}>
          <boxGeometry args={[0.028, 0.028, 0.006]} />
          <meshStandardMaterial color="#3a6ea5" roughness={0.1} />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.07, 0.925, 0.126]}>
          <boxGeometry args={[0.014, 0.014, 0.005]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0.07, 0.925, 0.126]}>
          <boxGeometry args={[0.014, 0.014, 0.005]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0.895, 0.124]}>
          <boxGeometry args={[0.028, 0.042, 0.018]} />
          <meshStandardMaterial color="#d9956e" roughness={0.75} />
        </mesh>
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, 0.85, 0.118]}>
          <boxGeometry args={[0.065, 0.014, 0.005]} />
          <meshStandardMaterial color="#c0604a" roughness={0.6} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.122, 0.925, 0]}>
          <boxGeometry args={[0.016, 0.055, 0.06]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh position={[0.122, 0.925, 0]}>
          <boxGeometry args={[0.016, 0.055, 0.06]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
