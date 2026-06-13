import { useState, useEffect, useRef, useCallback } from "react";
import type { PersonState } from "../components/room/Person";
import { SOFA_SIT_X, SOFA_SIT_Z, SOFA_SIT_ANGLE } from "../components/room/Person";

// Room bounds (keep character inside)
const MIN_X = -3.2;
const MAX_X = 3.2;
const MIN_Z = -3.0;
const MAX_Z = 3.2;

// Speed
const WALK_SPEED = 2.2; // units per second
const TURN_SPEED = 3.0;

// Sofa proximity threshold
const SOFA_SIT_RADIUS = 0.9;

export function usePersonMovement() {
  const keysRef = useRef<Set<string>>(new Set());
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [personState, setPersonState] = useState<PersonState>({
    x: 1.5,
    z: 1.2,
    angle: Math.PI * 1.15,
    sitting: false,
    walking: false,
  });

  // Track keys
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      // Prevent page scroll
      if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Sit/stand toggle on Space or E
  const toggleSit = useCallback(() => {
    setPersonState(prev => {
      if (prev.sitting) {
        return { ...prev, sitting: false };
      }
      // Check if near sofa
      const dx = prev.x - SOFA_SIT_X;
      const dz = prev.z - SOFA_SIT_Z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < SOFA_SIT_RADIUS) {
        return {
          x: SOFA_SIT_X,
          z: SOFA_SIT_Z,
          angle: SOFA_SIT_ANGLE,
          sitting: true,
          walking: false,
        };
      }
      return prev;
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.05);
      lastTimeRef.current = now;

      const keys = keysRef.current;

      const moveForward = keys.has("arrowup") || keys.has("w");
      const moveBack = keys.has("arrowdown") || keys.has("s");
      const turnLeft = keys.has("arrowleft") || keys.has("a");
      const turnRight = keys.has("arrowright") || keys.has("d");
      const sitKey = keys.has(" ") || keys.has("e");

      // One-shot sit key
      if (sitKey && !keysRef.current.has("__sitting_pressed")) {
        keysRef.current.add("__sitting_pressed");
        setPersonState(prev => {
          if (prev.sitting) return { ...prev, sitting: false };
          const dx = prev.x - SOFA_SIT_X;
          const dz = prev.z - SOFA_SIT_Z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < SOFA_SIT_RADIUS) {
            return { x: SOFA_SIT_X, z: SOFA_SIT_Z, angle: SOFA_SIT_ANGLE, sitting: true, walking: false };
          }
          return prev;
        });
      }
      if (!sitKey) keysRef.current.delete("__sitting_pressed");

      const anyMove = moveForward || moveBack || turnLeft || turnRight;

      setPersonState(prev => {
        if (prev.sitting && anyMove) {
          // Stand up when moving
          return { ...prev, sitting: false };
        }
        if (prev.sitting) return prev;

        let { x, z, angle } = prev;
        let walking = false;

        if (turnLeft) angle += TURN_SPEED * dt;
        if (turnRight) angle -= TURN_SPEED * dt;

        if (moveForward) {
          x += Math.sin(angle) * WALK_SPEED * dt;
          z += Math.cos(angle) * WALK_SPEED * dt;
          walking = true;
        }
        if (moveBack) {
          x -= Math.sin(angle) * WALK_SPEED * dt;
          z -= Math.cos(angle) * WALK_SPEED * dt;
          walking = true;
        }

        // Clamp to room
        x = Math.max(MIN_X, Math.min(MAX_X, x));
        z = Math.max(MIN_Z, Math.min(MAX_Z, z));

        return { x, z, angle, sitting: false, walking };
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return { personState, toggleSit };
}
