import { useMemo } from "react";
import * as THREE from "three";

interface RoomProps {
  lightOn: boolean;
  tvOn: boolean;
}

export function Room({ lightOn, tvOn }: RoomProps) {
  const wallColor = "#ede5d8";
  const floorColor = "#8B6914";
  const ceilingColor = "#f5f1eb";
  const trimColor = "#c8b48e";

  const floorGeo = useMemo(() => new THREE.BoxGeometry(8, 0.1, 8), []);

  return (
    <group>
      {/* ══════════════════════ STRUCTURE ══════════════════════ */}

      {/* Floor */}
      <mesh geometry={floorGeo} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color={floorColor} roughness={0.58} metalness={0.04} />
      </mesh>
      {/* Floor plank seams */}
      {[-3, -1.5, 0, 1.5, 3].map((z) => (
        <mesh key={z} position={[0, 0.002, z]} receiveShadow>
          <boxGeometry args={[8, 0.004, 0.018]} />
          <meshStandardMaterial color="#5a3e0a" roughness={0.85} />
        </mesh>
      ))}

      {/* Rug under sofa area */}
      <mesh position={[0.5, 0.003, -2.2]} receiveShadow rotation={[0, 0.05, 0]}>
        <boxGeometry args={[2.8, 0.01, 1.8]} />
        <meshStandardMaterial color="#7a3a2a" roughness={0.95} />
      </mesh>
      {/* Rug border pattern */}
      <mesh position={[0.5, 0.008, -2.2]} receiveShadow rotation={[0, 0.05, 0]}>
        <boxGeometry args={[2.65, 0.005, 0.06]} />
        <meshStandardMaterial color="#c8a060" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} />
      </mesh>

      {/* Ceiling cornice */}
      {[
        { p: [0, 3.97, -3.96] as [number,number,number], s: [8.1, 0.07, 0.07] as [number,number,number] },
        { p: [0, 3.97, 3.96] as [number,number,number], s: [8.1, 0.07, 0.07] as [number,number,number] },
        { p: [-3.96, 3.97, 0] as [number,number,number], s: [0.07, 0.07, 8.1] as [number,number,number] },
        { p: [3.96, 3.97, 0] as [number,number,number], s: [0.07, 0.07, 8.1] as [number,number,number] },
      ].map((c, i) => (
        <mesh key={i} position={c.p}>
          <boxGeometry args={c.s} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 2, -4]} receiveShadow castShadow>
        <boxGeometry args={[8, 8, 0.1]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-4, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[4, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Skirting boards */}
      <mesh position={[0, 0.1, -3.96]}>
        <boxGeometry args={[8, 0.18, 0.05]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} />
      </mesh>
      <mesh position={[-3.96, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.18, 8]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} />
      </mesh>
      <mesh position={[3.96, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.18, 8]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} />
      </mesh>

      {/* ══════════════════════ WINDOW (right wall) ══════════════════════ */}
      {/* Window frame */}
      <mesh position={[3.96, 2.3, -1.5]}>
        <boxGeometry args={[0.13, 1.9, 1.5]} />
        <meshStandardMaterial color="#d4c5a9" roughness={0.6} />
      </mesh>
      {/* Glass */}
      <mesh position={[3.92, 2.3, -1.5]}>
        <boxGeometry args={[0.05, 1.7, 1.3]} />
        <meshStandardMaterial color={lightOn ? "#a8cce8" : "#4a6595"} transparent opacity={0.32} roughness={0.05} metalness={0.12} />
      </mesh>
      {/* Cross bars */}
      <mesh position={[3.91, 2.3, -1.5]}>
        <boxGeometry args={[0.06, 0.04, 1.3]} />
        <meshStandardMaterial color="#c4b090" />
      </mesh>
      <mesh position={[3.91, 2.3, -1.5]}>
        <boxGeometry args={[0.06, 1.7, 0.04]} />
        <meshStandardMaterial color="#c4b090" />
      </mesh>
      {/* Window sill */}
      <mesh position={[3.75, 1.32, -1.5]}>
        <boxGeometry args={[0.55, 0.065, 1.6]} />
        <meshStandardMaterial color="#d4c5a9" roughness={0.5} />
      </mesh>

      {/* Curtains */}
      <mesh position={[3.88, 2.6, -0.72]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.04, 1.6, 0.38]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.95} transparent opacity={0.9} />
      </mesh>
      <mesh position={[3.88, 2.6, -2.28]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.04, 1.6, 0.38]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.95} transparent opacity={0.9} />
      </mesh>
      {/* Curtain rod */}
      <mesh position={[3.88, 3.48, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.7, 8]} />
        <meshStandardMaterial color="#8a6a30" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ══════════════════════ SOFA (back wall, centered) ══════════════════════ */}
      {/* Sofa base */}
      <mesh position={[0.5, 0.3, -3.35]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.55, 0.95]} />
        <meshStandardMaterial color="#607080" roughness={0.88} />
      </mesh>
      {/* Sofa back */}
      <mesh position={[0.5, 0.9, -3.75]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.95, 0.28]} />
        <meshStandardMaterial color="#607080" roughness={0.88} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-1.2, 0.62, -3.35]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.62, 0.95]} />
        <meshStandardMaterial color="#506070" roughness={0.88} />
      </mesh>
      {/* Right arm */}
      <mesh position={[2.2, 0.62, -3.35]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.62, 0.95]} />
        <meshStandardMaterial color="#506070" roughness={0.88} />
      </mesh>
      {/* Cushions */}
      {[-0.7, 0.5, 1.7].map((cx) => (
        <mesh key={cx} position={[cx, 0.62, -3.3]} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.72]} />
          <meshStandardMaterial color="#6a8090" roughness={0.85} />
        </mesh>
      ))}
      {/* Back pillows */}
      {[-0.4, 1.4].map((cx) => (
        <mesh key={cx} position={[cx, 1.02, -3.62]} castShadow>
          <boxGeometry args={[0.4, 0.42, 0.18]} />
          <meshStandardMaterial color="#8a5a40" roughness={0.85} />
        </mesh>
      ))}

      {/* ══════════════════════ TV + STAND (LEFT WALL) ══════════════════════ */}
      {/* TV stand */}
      <mesh position={[-3.6, 0.3, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.6, 1.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </mesh>
      {/* TV body (bezel) */}
      <mesh position={[-3.88, 1.35, -0.5]} castShadow>
        <boxGeometry args={[0.1, 1.1, 1.8]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* TV screen — OFF: black, ON: glowing blue content */}
      <mesh position={[-3.84, 1.35, -0.5]}>
        <boxGeometry args={[0.015, 0.96, 1.64]} />
        <meshStandardMaterial
          color={tvOn ? "#1a3a8a" : "#060606"}
          emissive={tvOn ? "#0828c0" : "#000"}
          emissiveIntensity={tvOn ? 0.9 : 0}
          roughness={0.05}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* TV screen content overlay — bright stripe when on (simulated image) */}
      {tvOn && (
        <>
          {/* Top bar (like a news ticker) */}
          <mesh position={[-3.825, 0.92, -0.5]}>
            <boxGeometry args={[0.008, 0.09, 1.62]} />
            <meshStandardMaterial color="#ff4444" emissive="#dd2222" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          {/* Content bands */}
          <mesh position={[-3.825, 1.35, -0.5]}>
            <boxGeometry args={[0.008, 0.42, 1.62]} />
            <meshStandardMaterial color="#1040c0" emissive="#0830c0" emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
          {/* Bottom text bar */}
          <mesh position={[-3.825, 0.99, -0.5]}>
            <boxGeometry args={[0.008, 0.12, 1.62]} />
            <meshStandardMaterial color="#001855" emissive="#001040" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
          {/* Bright highlight (like on-screen element) */}
          <mesh position={[-3.823, 1.4, -0.1]}>
            <boxGeometry args={[0.006, 0.28, 0.38]} />
            <meshStandardMaterial color="#80b0ff" emissive="#60a0ff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </>
      )}

      {/* TV power LED */}
      <mesh position={[-3.84, 0.82, 0.84]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial
          color={tvOn ? "#00ff44" : "#330000"}
          emissive={tvOn ? "#00ff44" : "#000"}
          emissiveIntensity={tvOn ? 2.0 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* TV screen reflection glow on stand/wall when on */}
      {tvOn && (
        <mesh position={[-3.5, 1.35, -0.5]}>
          <boxGeometry args={[0.005, 1.1, 1.8]} />
          <meshStandardMaterial color="#2040c0" transparent opacity={0.08} emissive="#1030b0" emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
      )}

      {/* TV stand neck */}
      <mesh position={[-3.72, 0.66, -0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#222" roughness={0.4} />
      </mesh>

      {/* ══════════════════════ COFFEE TABLE ══════════════════════ */}
      <mesh position={[0.5, 0.35, -1.9]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.07, 0.75]} />
        <meshStandardMaterial color="#5a3e18" roughness={0.48} metalness={0.06} />
      </mesh>
      {[[-0.62,-0.29],[-.62,0.29],[0.62,-0.29],[0.62,0.29]].map(([lx,lz],i) => (
        <mesh key={i} position={[0.5+lx, 0.18, -1.9+lz]} castShadow>
          <boxGeometry args={[0.055, 0.36, 0.055]} />
          <meshStandardMaterial color="#4a3010" roughness={0.7} />
        </mesh>
      ))}
      {/* Coffee cup on table */}
      <mesh position={[0.2, 0.42, -1.9]}>
        <cylinderGeometry args={[0.055, 0.042, 0.1, 10]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.47, -1.9]}>
        <cylinderGeometry args={[0.048, 0.048, 0.01, 10]} />
        <meshStandardMaterial color="#3a1a0a" roughness={0.3} />
      </mesh>
      {/* Book on table */}
      <mesh position={[0.85, 0.41, -1.85]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.18, 0.03, 0.28]} />
        <meshStandardMaterial color="#b04030" roughness={0.7} />
      </mesh>

      {/* ══════════════════════ BOOKSHELF (back-left corner) ══════════════════════ */}
      {/* Shelf unit */}
      <mesh position={[-3.6, 1.5, -3.6]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 2.9, 1.2]} />
        <meshStandardMaterial color="#5a3a10" roughness={0.65} />
      </mesh>
      {/* Shelf boards */}
      {[0.4, 1.0, 1.6, 2.2].map((sy) => (
        <mesh key={sy} position={[-3.42, sy, -3.6]}>
          <boxGeometry args={[0.04, 0.04, 1.15]} />
          <meshStandardMaterial color="#7a5020" roughness={0.6} />
        </mesh>
      ))}
      {/* Books on shelves */}
      {[
        { x: -3.42, y: 0.65, z: -3.8, w: 0.06, h: 0.22, c: "#c04040" },
        { x: -3.42, y: 0.65, z: -3.65, w: 0.06, h: 0.2, c: "#4060c0" },
        { x: -3.42, y: 0.65, z: -3.5, w: 0.07, h: 0.24, c: "#40a060" },
        { x: -3.42, y: 0.65, z: -3.35, w: 0.055, h: 0.21, c: "#c08020" },
        { x: -3.42, y: 1.25, z: -3.75, w: 0.065, h: 0.22, c: "#802040" },
        { x: -3.42, y: 1.25, z: -3.58, w: 0.06, h: 0.2, c: "#206080" },
        { x: -3.42, y: 1.25, z: -3.42, w: 0.07, h: 0.23, c: "#804020" },
        { x: -3.42, y: 1.85, z: -3.72, w: 0.06, h: 0.21, c: "#408030" },
        { x: -3.42, y: 1.85, z: -3.55, w: 0.065, h: 0.2, c: "#a03050" },
        { x: -3.42, y: 1.85, z: -3.38, w: 0.055, h: 0.22, c: "#305090" },
      ].map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} castShadow>
          <boxGeometry args={[b.w, b.h, 0.14]} />
          <meshStandardMaterial color={b.c} roughness={0.75} />
        </mesh>
      ))}
      {/* Small plant on top shelf */}
      <mesh position={[-3.42, 2.75, -3.45]}>
        <cylinderGeometry args={[0.08, 0.06, 0.14, 10]} />
        <meshStandardMaterial color="#8b3a12" roughness={0.8} />
      </mesh>
      <mesh position={[-3.42, 2.96, -3.45]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#2a7a2a" roughness={0.9} />
      </mesh>

      {/* ══════════════════════ SIDE TABLE + LAMP (right wall) ══════════════════════ */}
      {/* Side table */}
      <mesh position={[3.4, 0.4, 1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.28, 0.06, 16]} />
        <meshStandardMaterial color="#5a3e18" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Table leg */}
      <mesh position={[3.4, 0.19, 1.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.4, 8]} />
        <meshStandardMaterial color="#4a3010" roughness={0.65} />
      </mesh>
      {/* Table base */}
      <mesh position={[3.4, 0.01, 1.5]}>
        <cylinderGeometry args={[0.22, 0.22, 0.025, 16]} />
        <meshStandardMaterial color="#4a3010" roughness={0.65} />
      </mesh>
      {/* Floor lamp */}
      <mesh position={[3.4, 1.0, 1.5]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lamp shade */}
      <mesh position={[3.4, 1.65, 1.5]} castShadow>
        <coneGeometry args={[0.2, 0.22, 14, 1, true]} />
        <meshStandardMaterial
          color="#e8c870"
          side={THREE.DoubleSide}
          roughness={0.7}
          transparent
          opacity={0.88}
          emissive={lightOn ? "#c8a030" : "#000"}
          emissiveIntensity={lightOn ? 0.3 : 0}
        />
      </mesh>
      {/* Lamp base ring */}
      <mesh position={[3.4, 1.54, 1.5]}>
        <torusGeometry args={[0.045, 0.007, 8, 20]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* ══════════════════════ WALL CLOCK (back wall) ══════════════════════ */}
      {/* Clock body */}
      <mesh position={[2.5, 2.8, -3.93]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 24]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.4} />
      </mesh>
      {/* Clock face */}
      <mesh position={[2.5, 2.8, -3.9]}>
        <circleGeometry args={[0.26, 24]} />
        <meshStandardMaterial color="#f8f4ec" roughness={0.3} />
      </mesh>
      {/* Hour hand */}
      <mesh position={[2.5, 2.84, -3.88]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.018, 0.14, 0.008]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Minute hand */}
      <mesh position={[2.5, 2.74, -3.88]} rotation={[0, 0, 1.2]}>
        <boxGeometry args={[0.012, 0.2, 0.008]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Clock center pin */}
      <mesh position={[2.5, 2.8, -3.87]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#c0a020" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Clock rim */}
      <mesh position={[2.5, 2.8, -3.9]}>
        <torusGeometry args={[0.27, 0.015, 8, 32]} />
        <meshStandardMaterial color="#8a7a50" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* ══════════════════════ POTTED PLANTS ══════════════════════ */}
      {/* Corner plant (right-back) */}
      <mesh position={[3.3, 0.22, -3.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.36, 12]} />
        <meshStandardMaterial color="#b04020" roughness={0.85} />
      </mesh>
      <mesh position={[3.3, 0.62, -3.5]} castShadow>
        <sphereGeometry args={[0.26, 9, 9]} />
        <meshStandardMaterial color="#2a6a2a" roughness={0.9} />
      </mesh>
      <mesh position={[3.18, 0.68, -3.38]} castShadow>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#357535" roughness={0.9} />
      </mesh>
      <mesh position={[3.42, 0.7, -3.38]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#2f8a2f" roughness={0.9} />
      </mesh>

      {/* Small plant near window sill */}
      <mesh position={[3.55, 1.42, -1.5]}>
        <cylinderGeometry args={[0.07, 0.055, 0.12, 10]} />
        <meshStandardMaterial color="#c05020" roughness={0.8} />
      </mesh>
      <mesh position={[3.55, 1.58, -1.5]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#2a8a50" roughness={0.9} />
      </mesh>

      {/* ══════════════════════ PICTURE FRAMES (back wall) ══════════════════════ */}
      {/* Frame 1 */}
      <mesh position={[-1.5, 2.6, -3.93]} castShadow>
        <boxGeometry args={[0.6, 0.45, 0.04]} />
        <meshStandardMaterial color="#5a3e18" roughness={0.6} />
      </mesh>
      <mesh position={[-1.5, 2.6, -3.91]}>
        <boxGeometry args={[0.5, 0.35, 0.01]} />
        <meshStandardMaterial color={lightOn ? "#6090c0" : "#304878"} roughness={0.2} />
      </mesh>
      {/* Frame 2 */}
      <mesh position={[-2.4, 2.5, -3.93]} castShadow>
        <boxGeometry args={[0.38, 0.5, 0.04]} />
        <meshStandardMaterial color="#3a2810" roughness={0.6} />
      </mesh>
      <mesh position={[-2.4, 2.5, -3.91]}>
        <boxGeometry args={[0.28, 0.4, 0.01]} />
        <meshStandardMaterial color={lightOn ? "#a06040" : "#503020"} roughness={0.2} />
      </mesh>

      {/* ══════════════════════ DOOR OPENING (left wall cutout) ══════════════════════ */}
      {/* Wall above door opening */}
      <mesh position={[-3.95, 3.2, 1.29]} castShadow>
        <boxGeometry args={[0.1, 1.55, 0.98]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      {/* Wall behind door (far side) */}
      <mesh position={[-3.95, 1.1, 3.0]} castShadow>
        <boxGeometry args={[0.1, 2.2, 3.9]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      {/* Wall in front of door (near side) */}
      <mesh position={[-3.95, 1.1, 0.3]} castShadow>
        <boxGeometry args={[0.1, 2.2, 0.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
    </group>
  );
}
