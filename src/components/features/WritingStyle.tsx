import { ChevronDown, Pen, BookOpen, Briefcase, GraduationCap, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Style = 'general' | 'academic' | 'business' | 'creative' | 'casual';

interface WritingStyleProps {
  selected: Style;
  onSelect: (style: Style) => void;
}

const styles = [
  { id: 'general' as Style, name: 'General', icon: Pen },
  { id: 'academic' as Style, name: 'Academic', icon: GraduationCap },
  { id: 'business' as Style, name: 'Business', icon: Briefcase },
  { id: 'creative' as Style, name: 'Creative', icon: BookOpen },
  { id: 'casual' as Style, name: 'Casual', icon: MessageSquare },
];

export const WritingStyle = ({ selected, onSelect }: WritingStyleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedStyle = styles.find(s => s.id === selected) || styles[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-foreground/20 transition-colors bg-background"
      >
        <selectedStyle.icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{selectedStyle.name}</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-scale">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => {
                onSelect(style.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-secondary transition-colors",
                selected === style.id && "bg-secondary"
              )}
            >
              <style.icon className="w-4 h-4 text-muted-foreground" />
              <span>{style.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
