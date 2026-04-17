import { useState, useCallback, useEffect, useRef } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-GB';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        // Cancel any ongoing speech to avoid interference
        window.speechSynthesis.cancel();
        
        setTranscript('');
        setIsListening(true);
        
        // Small delay to ensure synthesis is aborted and hardware released
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (err: any) {
            // If already started, just ignore
            if (err.name !== 'InvalidStateError') {
              console.error('Failed to start speech recognition:', err);
              setIsListening(false);
            }
          }
        }, 300);
      } catch (err) {
        console.error('Failed to prepare speech recognition:', err);
        setIsListening(false);
      }
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    hasSupport: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
  };
}
