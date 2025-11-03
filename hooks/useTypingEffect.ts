import { useState, useEffect, useRef } from 'react';

export const useTypingEffect = (fullText: string = '', speed: number = 50) => {
    const [typedText, setTypedText] = useState('');
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (speed === 0 || !fullText) {
            setTypedText(fullText);
            return;
        }

        setTypedText('');

        let i = 0;
        let visibleText = '';

        intervalRef.current = window.setInterval(() => {
            if (i >= fullText.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            const char = fullText[i];
            if (char === '<') {
                const closingTagIndex = fullText.indexOf('>', i);
                if (closingTagIndex !== -1) {
                    visibleText += fullText.substring(i, closingTagIndex + 1);
                    i = closingTagIndex + 1;
                } else {
                    visibleText += char;
                    i++;
                }
            } else {
                visibleText += char;
                i++;
            }
            setTypedText(visibleText);
        }, speed);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fullText, speed]);

    return { typedText };
};