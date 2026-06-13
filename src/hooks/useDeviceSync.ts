import { useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { DeviceState } from "../types";

const DEVICE_DOC = doc(db, "home", "devices");

/**
 * Syncs device state to Firestore.
 *
 * - Writes the current state to Firestore whenever it changes.
 * - Returns an unsubscribe function that listens for remote changes
 *   (useful if you want multi-device sync in the future).
 */
export function useDeviceSync(
  state: DeviceState,
  onRemoteUpdate?: (remoteState: DeviceState) => void
) {
  // Push local state to Firestore on every change
  useEffect(() => {
    setDoc(DEVICE_DOC, state, { merge: true }).catch((err) =>
      console.error("[Firebase] Failed to sync device state:", err)
    );
  }, [state]);

  // Optionally listen for remote state changes (e.g. from another device)
  useEffect(() => {
    if (!onRemoteUpdate) return;

    const unsubscribe = onSnapshot(
      DEVICE_DOC,
      (snapshot) => {
        if (snapshot.exists()) {
          onRemoteUpdate(snapshot.data() as DeviceState);
        }
      },
      (err) => console.error("[Firebase] Snapshot error:", err)
    );

    return unsubscribe;
  }, [onRemoteUpdate]);
}
