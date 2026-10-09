// Speech recognition and synthesis service with Marathi, Hindi, English, and global support

export interface SpeechCallbacks {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onWakeWordDetected?: (keyword: string) => void;
  onListeningStateChange: (isListening: boolean) => void;
  onError: (error: string) => void;
}

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private wakeWords = ["hey ro", "ro aik", "ro", "mavla", "ro suno"];
  private callbacks: SpeechCallbacks | null = null;
  private currentLanguage = "mr-IN"; // Default to Marathi
  private isSpeaking = false;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks?.onListeningStateChange(true);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim().toLowerCase();

        // Check for wake words
        for (const wakeWord of this.wakeWords) {
          if (combined.includes(wakeWord)) {
            this.callbacks?.onWakeWordDetected?.(wakeWord);
            this.playWakeSound();
            break;
          }
        }

        this.callbacks?.onTranscriptChange(
          finalTranscript || interimTranscript,
          Boolean(finalTranscript)
        );
      };

      this.recognition.onerror = (event: any) => {
        // Handle common speech errors gracefully
        if (event.error !== "no-speech" && event.error !== "aborted") {
          this.callbacks?.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks?.onListeningStateChange(false);
      };
    } catch (e: any) {
      console.error("Failed to initialize speech recognition:", e);
    }
  }

  public setCallbacks(callbacks: SpeechCallbacks) {
    this.callbacks = callbacks;
  }

  public setLanguage(langCode: string) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      const wasListening = this.isListening;
      if (wasListening) {
        this.stopListening();
      }
      this.recognition.lang = langCode;
      if (wasListening) {
        setTimeout(() => this.startListening(), 200);
      }
    }
  }

  public startListening() {
    if (!this.recognition) {
      this.callbacks?.onError("Speech recognition not supported");
      return;
    }
    try {
      this.stopSpeaking();
      this.recognition.start();
    } catch {
      // Ignore if already running
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  public getIsListening() {
    return this.isListening;
  }

  public stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(text: string, lang = "mr-IN", rate = 1.0, pitch = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || !text) {
        resolve();
        return;
      }

      this.stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice = voices.find(
        (v) => v.lang === lang || v.lang.replace("_", "-") === lang
      );

      // Fallback matching
      if (!matchedVoice && lang.startsWith("mr")) {
        matchedVoice = voices.find((v) => v.lang.includes("mr") || v.lang.includes("hi"));
      } else if (!matchedVoice && lang.startsWith("hi")) {
        matchedVoice = voices.find((v) => v.lang.includes("hi"));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = lang;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // Modern AudioContext chime
  private playWakeSound() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }
}

export const speechService = new SpeechService();
