/**
 * SpeechService: Integrates Browser Web Speech API for TTS and STT,
 * plus MediaRecorder for Self-Audio Playback and Visual Soundwave Animation.
 */

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.voices = [];
    this.preferredVoice = null;

    // MediaRecorder fields for student voice playback
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.lastRecordedAudioUrl = null;
    this.audioContext = null;
    this.analyser = null;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.preferredVoice =
        this.voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
        this.voices.find(v => v.lang === 'en-US' && v.name.includes('Natural')) ||
        this.voices.find(v => v.lang === 'en-US') ||
        this.voices.find(v => v.lang.startsWith('en')) ||
        this.voices[0];
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  speak(text, rate = 1.0, onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // 0.75x for slow breakdown, 1.0x normal
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      this.supportsRecognition = false;
      return;
    }

    this.supportsRecognition = true;
    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;
  }

  async startListening(callbacks = {}) {
    const { onStart, onResult, onError, onEnd } = callbacks;

    if (!this.supportsRecognition) {
      if (onError) onError({ error: 'not-supported', message: 'Web Speech API is not supported in this browser.' });
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    // Try starting MediaRecorder simultaneously to record audio for self-playback
    this.audioChunks = [];
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          if (this.lastRecordedAudioUrl) {
            URL.revokeObjectURL(this.lastRecordedAudioUrl);
          }
          this.lastRecordedAudioUrl = URL.createObjectURL(audioBlob);
          // Stop stream tracks
          stream.getTracks().forEach(track => track.stop());
        };
        this.mediaRecorder.start();
      } catch (micErr) {
        console.warn('MediaRecorder not available or mic permission refused:', micErr.message);
      }
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      if (onResult) onResult(transcript, confidence, event.results[0]);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      if (onError) onError({ error: 'start-failed', message: e.message });
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  playRecordedVoice() {
    if (!this.lastRecordedAudioUrl) {
      alert('No recorded voice found for this session yet. Speak into the microphone first!');
      return;
    }
    const audio = new Audio(this.lastRecordedAudioUrl);
    audio.play();
  }
}

window.SpeechService = new SpeechService();
