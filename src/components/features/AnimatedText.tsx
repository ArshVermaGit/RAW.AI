import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedText = ({ text, className = '', delay = 0 }: AnimatedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <span
        className={`inline-block transition-transform duration-700 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {text}
      </span>
    </span>
  );
};

interface AnimatedLettersProps {
  text: string;
  className?: string;
  baseDelay?: number;
}

export const AnimatedLetters = ({ text, className = '', baseDelay = 0 }: AnimatedLettersProps) => {
  return (
    <span className={`letter-animation ${className}`}>
      {text.split('').map((letter, index) => (
        <span
          key={index}
          style={{ animationDelay: `${baseDelay + index * 50}ms` }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};
