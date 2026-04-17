import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a British English voice
    const voices = window.speechSynthesis.getVoices();
    const brVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en_GB');
    if (brVoice) {
      utterance.voice = brVoice;
    }
    
    utterance.lang = 'en-GB';
    utterance.rate = 0.9; // Slightly slower for clarity
    
    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
