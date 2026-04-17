import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to ensure previous speech is canceled
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        // Priority: British English -> English -> Any
        const brVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en_GB');
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        
        utterance.voice = brVoice || enVoice || voices[0] || null;
        utterance.lang = utterance.voice?.lang || 'en-GB';
        utterance.rate = 0.85; // Slightly slower for clarity
        
        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = (err) => {
            console.error('Speech synthesis error:', err);
            onEnd(); // Call onEnd even on error to prevent UI stuck
          };
        }

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        // Voices not loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
          window.speechSynthesis.onvoiceschanged = null; // Clean up
        };
        // Fallback speak anyway if voiceschanged doesn't fire
        setTimeout(() => {
            if (!utterance.voice) setVoiceAndSpeak();
        }, 100);
      }
    }, 50);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
