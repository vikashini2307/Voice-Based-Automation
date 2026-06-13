import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoomDoorProps {
  isOpen: boolean;
  /**
   * Position of the door's HINGE edge at floor level.
   * The door slab extends in +Z direction from this point.
   * The door is embedded in the left wall (x = -4), so position.x ≈ -3.95.
   */
  position: [number, number, number];
}

export function RoomDoor({ isOpen, position }: RoomDoorProps) {
  const doorRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);

  // Swings INTO the room (negative Y rotation = door swings forward into +X space)
  const targetAngle = isOpen ? Math.PI * 0.42 : 0;

  useFrame((_, delta) => {
    if (!doorRef.current) return;
    angleRef.current += (targetAngle - angleRef.current) * delta * 3.5;
    doorRef.current.rotation.y = angleRef.current;
  });

  const frameColor = "#d4c49e";
  const doorColor = "#c8a050";
  const doorDark = "#a07d38";
  const knobColor = "#c8a020";

  // Door dimensions
  const doorW = 0.88;  // width of door slab
  const doorH = 2.1;   // height
  const doorT = 0.07;  // thickness

  // Frame dimensions
  const jambW = 0.1;
  const jambD = 0.18;  // depth (into wall)
  const topH = 0.14;

  return (
    <group position={position}>

      {/* ── DOOR FRAME (static, embedded in wall) ── */}

      {/* Hinge-side jamb (at z=0, left side of opening) */}
      <mesh position={[-jambW / 2, doorH / 2, 0]} castShadow>
        <boxGeometry args={[jambW, doorH + topH * 2, jambD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Latch-side jamb (at z = doorW + jambW, right side of opening) */}
      <mesh position={[-jambW / 2, doorH / 2, doorW + jambW]} castShadow>
        <boxGeometry args={[jambW, doorH + topH * 2, jambD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Top header */}
      <mesh position={[-jambW / 2, doorH + topH / 2, doorW / 2 + jambW / 2]} castShadow>
        <boxGeometry args={[jambW, topH, doorW + jambW * 2]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Door stop trim (inner edge of frame) */}
      <mesh position={[0.015, doorH / 2, -jambD / 2 + 0.01]}>
        <boxGeometry args={[0.025, doorH, 0.025]} />
        <meshStandardMaterial color="#bba878" roughness={0.7} />
      </mesh>
      <mesh position={[0.015, doorH / 2, doorW + jambD / 2 - 0.01]}>
        <boxGeometry args={[0.025, doorH, 0.025]} />
        <meshStandardMaterial color="#bba878" roughness={0.7} />
      </mesh>

      {/* ── DOOR SLAB — pivots from hinge edge (z=0 side) ── */}
      {/*
        The pivot is at position [0, 0, 0] of this group (hinge at z=0).
        The slab center is offset half a door-width along Z.
        rotation.y swings it open into the room (−X direction from left wall).
      */}
      <group ref={doorRef} position={[0, 0, 0]}>

        {/* Main slab */}
        <mesh position={[doorT / 2, doorH / 2, doorW / 2]} castShadow receiveShadow>
          <boxGeometry args={[doorT, doorH, doorW]} />
          <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.02} />
        </mesh>

        {/* Decorative panel — upper */}
        <mesh position={[doorT / 2 + 0.005, doorH * 0.72, doorW / 2]}>
          <boxGeometry args={[0.01, doorH * 0.28, doorW * 0.72]} />
          <meshStandardMaterial color={doorDark} roughness={0.65} />
        </mesh>

        {/* Decorative panel — lower */}
        <mesh position={[doorT / 2 + 0.005, doorH * 0.3, doorW / 2]}>
          <boxGeometry args={[0.01, doorH * 0.28, doorW * 0.72]} />
          <meshStandardMaterial color={doorDark} roughness={0.65} />
        </mesh>

        {/* Panel bevel lines (horizontal) */}
        {[doorH * 0.55, doorH * 0.17].map((by, i) => (
          <mesh key={i} position={[doorT / 2 + 0.006, by, doorW / 2]}>
            <boxGeometry args={[0.008, 0.02, doorW * 0.72]} />
            <meshStandardMaterial color="#906c28" roughness={0.7} />
          </mesh>
        ))}

        {/* Knob — outside face */}
        <mesh position={[doorT / 2 + 0.06, doorH * 0.48, doorW * 0.82]} castShadow>
          <sphereGeometry args={[0.042, 14, 14]} />
          <meshStandardMaterial color={knobColor} metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Knob plate */}
        <mesh position={[doorT / 2 + 0.042, doorH * 0.48, doorW * 0.82]}>
          <boxGeometry args={[0.01, 0.18, 0.055]} />
          <meshStandardMaterial color="#b89018" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Knob — inside face */}
        <mesh position={[-0.025, doorH * 0.48, doorW * 0.82]} castShadow>
          <sphereGeometry args={[0.042, 14, 14]} />
          <meshStandardMaterial color={knobColor} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Hinge plates × 2 */}
        {[0.45, 1.65].map((hy, i) => (
          <mesh key={i} position={[doorT / 2 + 0.005, hy, 0.025]}>
            <boxGeometry args={[0.02, 0.12, 0.05]} />
            <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

      </group>
    </group>
  );
}
