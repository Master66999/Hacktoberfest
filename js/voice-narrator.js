/**
 * KitchenTales Voice Narrator & Hands-Free Kitchen Companion
 * Targets Best Use of ElevenLabs ($100) partner category
 * Supports ElevenLabs TTS API with native Web Speech API fallback,
 * Hands-Free Voice Commands in Cook Mode, and Live Speech-to-Text Transcription.
 */

export class VoiceNarrator {
  constructor() {
    this.apiKey = localStorage.getItem('kitchentales_elevenlabs_key') || '';
    this.voiceId = localStorage.getItem('kitchentales_elevenlabs_voice') || '21m00Tcm4TlvDq8ikWAM'; // Rachel (Warm, Natural)
    this.modelId = 'eleven_turbo_v2_5';
    this.isPlaying = false;
    this.currentAudio = null;
    this.synth = window.speechSynthesis;

    // Hands-Free Voice Command State
    this.recognition = null;
    this.isListeningCommands = false;
    this.commandCallback = null;
    this.commandStatusCallback = null;

    // Live Transcription State
    this.liveTranscriber = null;
    this.isLiveTranscribing = false;
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem('kitchentales_elevenlabs_key', this.apiKey);
  }

  setVoiceId(voiceId) {
    this.voiceId = voiceId;
    localStorage.setItem('kitchentales_elevenlabs_voice', this.voiceId);
  }

  getSettings() {
    return {
      apiKey: this.apiKey,
      voiceId: this.voiceId,
      hasElevenLabs: Boolean(this.apiKey)
    };
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
  }

  /**
   * Speak a text string using ElevenLabs if key available, else Web Speech API
   */
  async speak(text, options = {}) {
    this.stop();
    this.isPlaying = true;

    if (this.apiKey) {
      try {
        await this._speakElevenLabs(text, options);
        return;
      } catch (err) {
        console.warn('ElevenLabs TTS failed, falling back to Web Speech API:', err);
      }
    }

    // Fallback: Web Speech API
    this._speakWebSpeech(text, options);
  }

  async _speakElevenLabs(text, options) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: this.modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs error: HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    this.currentAudio = new Audio(audioUrl);

    if (options.onStart) options.onStart();
    
    this.currentAudio.onended = () => {
      this.isPlaying = false;
      if (options.onEnd) options.onEnd();
    };

    this.currentAudio.onerror = () => {
      this.isPlaying = false;
      if (options.onError) options.onError();
    };

    await this.currentAudio.play();
  }

  _speakWebSpeech(text, options) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      this.isPlaying = false;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1.0;

    // Pick a warm English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    if (options.onStart) utterance.onstart = options.onStart;
    utterance.onend = () => {
      this.isPlaying = false;
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      this.isPlaying = false;
      if (options.onError) options.onError();
    };

    this.synth.speak(utterance);
  }

  /**
   * ==========================================
   * Hands-Free Voice Commands for Cook Mode
   * ==========================================
   */
  startVoiceCommands(onCommand, onStatusUpdate) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onStatusUpdate) onStatusUpdate({ active: false, supported: false, message: 'Voice commands not supported in this browser' });
      return;
    }

    this.commandCallback = onCommand;
    this.commandStatusCallback = onStatusUpdate;
    this.isListeningCommands = true;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        if (this.commandStatusCallback) {
          this.commandStatusCallback({ active: true, supported: true, message: 'Listening: Say "Next", "Back", "Repeat", "Start Timer"' });
        }
      };

      this.recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        
        if (this.commandStatusCallback) {
          this.commandStatusCallback({ active: true, supported: true, lastHeard: transcript });
        }

        this._evaluateVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return;
        console.warn('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        // Auto-restart if hands-free cook mode is still active
        if (this.isListeningCommands) {
          try {
            this.recognition.start();
          } catch (e) {}
        } else {
          if (this.commandStatusCallback) {
            this.commandStatusCallback({ active: false, supported: true, message: 'Voice commands paused' });
          }
        }
      };

      this.recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      if (this.commandStatusCallback) {
        this.commandStatusCallback({ active: false, supported: true, message: 'Could not access voice commands' });
      }
    }
  }

  stopVoiceCommands() {
    this.isListeningCommands = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
    if (this.commandStatusCallback) {
      this.commandStatusCallback({ active: false, supported: true, message: 'Voice commands offline' });
    }
  }

  _evaluateVoiceCommand(transcript) {
    if (!this.commandCallback) return;

    if (transcript.includes('next') || transcript.includes('forward') || transcript.includes('continue')) {
      this.commandCallback('next', transcript);
    } else if (transcript.includes('back') || transcript.includes('previous') || transcript.includes('prev')) {
      this.commandCallback('previous', transcript);
    } else if (transcript.includes('repeat') || transcript.includes('read') || transcript.includes('again') || transcript.includes('say that')) {
      this.commandCallback('repeat', transcript);
    } else if (transcript.includes('start timer') || transcript.includes('start') || transcript.includes('begin timer')) {
      this.commandCallback('start_timer', transcript);
    } else if (transcript.includes('pause timer') || transcript.includes('pause') || transcript.includes('stop timer')) {
      this.commandCallback('pause_timer', transcript);
    } else if (transcript.includes('reset timer') || transcript.includes('reset')) {
      this.commandCallback('reset_timer', transcript);
    } else if (transcript.includes('exit') || transcript.includes('close') || transcript.includes('quit') || transcript.includes('done')) {
      this.commandCallback('exit', transcript);
    }
  }

  /**
   * ==========================================
   * Live Speech-to-Text Transcription for Studio
   * ==========================================
   */
  startLiveTranscription(onTextUpdate) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    try {
      this.liveTranscriber = new SpeechRecognition();
      this.liveTranscriber.continuous = true;
      this.liveTranscriber.interimResults = true;
      this.liveTranscriber.lang = 'en-US';
      this.isLiveTranscribing = true;

      let accumulated = '';

      this.liveTranscriber.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            accumulated += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (onTextUpdate) {
          onTextUpdate((accumulated + interim).trim());
        }
      };

      this.liveTranscriber.onerror = (e) => {
        console.warn('Live transcription error:', e.error);
      };

      this.liveTranscriber.onend = () => {
        if (this.isLiveTranscribing) {
          try {
            this.liveTranscriber.start();
          } catch (e) {}
        }
      };

      this.liveTranscriber.start();
      return this.liveTranscriber;
    } catch (e) {
      console.warn('Speech recognition for live recording not supported:', e);
      return null;
    }
  }

  stopLiveTranscription() {
    this.isLiveTranscribing = false;
    if (this.liveTranscriber) {
      try {
        this.liveTranscriber.stop();
      } catch (e) {}
      this.liveTranscriber = null;
    }
  }
}
