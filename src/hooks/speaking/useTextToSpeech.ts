import { useRef, useState, useEffect } from "react";
import { speakingTestService } from "@/services/speakingTestService";

/**
 * Hook for managing Text-to-Speech playback
 * Handles audio context, TTS API calls, and playback control
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount
    audioContextRef.current = new AudioContext();

    return () => {
      // Cleanup on unmount
      audioContextRef.current?.close();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  /**
   * Speak the given text using TTS API
   * @param text - Text to convert to speech (Japanese)
   */
  const speak = async (text: string): Promise<void> => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    setError(null);

    try {
      // Resume AudioContext if suspended (Safari requirement)
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const audioBlob = await speakingTestService.textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        setError("Không thể phát audio");
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      setIsSpeaking(false);
      setError(err.message || "Lỗi TTS");
      throw err;
    }
  };

  /**
   * Stop current playback
   */
  const stop = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }
  };

  return { 
    speak, 
    stop, 
    isSpeaking,
    error 
  };
}
