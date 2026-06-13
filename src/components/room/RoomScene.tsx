import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Room } from "./Room";
import { CeilingFan } from "./CeilingFan";
import { RoomLamp } from "./RoomLamp";
import { RoomDoor } from "./RoomDoor";
import { Person } from "./Person";
import { OutsideView } from "./OutsideView";
import type { PersonState } from "./Person";

interface RoomSceneProps {
  fanOn: boolean;
  lightOn: boolean;
  doorOpen: boolean;
  tvOn: boolean;
  isSpeaking: boolean;
  personState: PersonState;
}

export function RoomScene({ fanOn, lightOn, doorOpen, tvOn, isSpeaking, personState }: RoomSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [6, 4.5, 7.5], fov: 46 }}
        gl={{ antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={lightOn ? 0.55 : 0.12} />

        <pointLight
          position={[0, 3.0, 0]}
          intensity={lightOn ? 70 : 0}
          color="#fff6d8"
          castShadow
          shadow-mapSize={[1024, 1024]}
          decay={2}
          distance={11}
        />

        <pointLight
          position={[3.4, 1.6, 1.5]}
          intensity={lightOn ? 12 : 0}
          color="#ffd080"
          decay={2}
          distance={4}
        />

        {/* TV glow light — blue-ish, shines into room when TV is on */}
        <pointLight
          position={[-3.5, 1.35, -0.5]}
          intensity={tvOn ? 18 : 0}
          color="#6090ff"
          decay={2}
          distance={5}
        />

        <directionalLight
          position={[5, 3.5, -1.5]}
          intensity={0.28}
          color="#b8d4ff"
        />

        <Room lightOn={lightOn} tvOn={tvOn} />

        {/* Outside view visible through door when open */}
        <OutsideView doorOpen={doorOpen} />

        <CeilingFan isOn={fanOn} position={[0, 4.0, 0]} />
        <RoomLamp isOn={lightOn} position={[0, 4.0, 0]} />
        <RoomDoor isOpen={doorOpen} position={[-3.95, 0, 0.85]} />

        <Person
          personState={personState}
          isSpeaking={isSpeaking}
        />

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.38}
          scale={10}
          blur={2.2}
          far={4}
        />

        <OrbitControls
          target={[0, 1.6, 0]}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 2.8}
          maxAzimuthAngle={Math.PI / 2.8}
          minDistance={3.5}
          maxDistance={11}
          enablePan={false}
          makeDefault
        />

        <Environment preset="apartment" background={false} />
      </Canvas>
    </div>
  );
}
