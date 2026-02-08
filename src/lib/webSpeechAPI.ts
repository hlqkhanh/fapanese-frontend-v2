/**
 * Client-side Speech Recognition using Web Speech API
 * For instant feedback while server processes
 * Note: Works best on Chrome/Edge, limited support on Firefox/Safari
 */
export class WebSpeechRecognition {
  private recognition: any;
  private isSupported: boolean;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    this.isSupported = !!SpeechRecognition;

    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "ja-JP"; // Japanese
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  /**
   * Transcribe audio blob using browser's built-in STT
   * Fast but less accurate than server - use for instant feedback only
   * @param audioBlob - Recorded audio blob
   * @returns Transcribed text with confidence score
   */
  async transcribe(audioBlob: Blob): Promise<{
    text: string;
    confidence: number;
  }> {
    if (!this.isSupported) {
      throw new Error("Web Speech API not supported in this browser");
    }

    return new Promise((resolve, reject) => {
      // Convert blob to audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      let resolved = false;

      this.recognition.onresult = (event: any) => {
        if (resolved) return;
        resolved = true;

        const result = event.results[0][0];
        const transcript = result.transcript;
        const confidence = result.confidence || 0.5;

        URL.revokeObjectURL(audioUrl);
        resolve({ text: transcript, confidence });
      };

      this.recognition.onerror = (event: any) => {
        if (resolved) return;
        resolved = true;

        URL.revokeObjectURL(audioUrl);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onspeechend = () => {
        this.recognition.stop();
      };

      // Start recognition with audio
      audio.onloadedmetadata = () => {
        this.recognition.start();
        audio.play().catch((err: Error) => {
          console.warn("Audio playback failed (okay for recognition):", err);
        });
      };

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.recognition.stop();
          URL.revokeObjectURL(audioUrl);
          reject(new Error("Speech recognition timeout"));
        }
      }, 10000);
    });
  }

  /**
   * Check if Web Speech API is available in current browser
   */
  isAvailable(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const webSpeechAPI = new WebSpeechRecognition();
