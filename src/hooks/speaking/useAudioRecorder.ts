import { useRef, useState } from "react";
import type { RecordingStatus } from "@/types/speakingTest";

/**
 * Hook for managing audio recording using MediaRecorder API
 * Handles microphone access, recording, and returning audio blobs
 */
export function useAudioRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Start recording audio from microphone
   * Requires user permission for microphone access
   */
  const startRecording = async (): Promise<void> => {
    if (status !== "idle") {
      throw new Error("Cannot start recording: recorder is busy");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch (err) {
      setStatus("error");
      throw new Error("Không thể truy cập microphone. Vui lòng cấp quyền.");
    }
  };

  /**
   * Stop recording and return audio blob
   * @returns Promise that resolves with recorded audio blob
   */
  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || status !== "recording") {
        reject(new Error("Không có recording đang chạy"));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        // Stop all tracks to release microphone
        mediaRecorderRef.current?.stream
          .getTracks()
          .forEach((track) => track.stop());

        setStatus("idle");
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  };

  return {
    status,
    setStatus,
    startRecording,
    stopRecording,
    isRecording: status === "recording",
  };
}
