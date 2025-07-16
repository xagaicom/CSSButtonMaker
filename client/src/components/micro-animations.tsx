import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Floating particles animation for background
export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-300/30 rounded-full"
          initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
          animate={{
            x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
            y: [`${particle.y}%`, `${particle.y - 15}%`, `${particle.y}%`],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Animated success checkmark
export function SuccessCheckmark({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block ml-2"
        >
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="text-white"
            >
              <motion.path
                d="M2 5L4 7L8 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Bouncing dots loader
export function BouncingDotsLoader() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Ripple effect for buttons
export function RippleEffect({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-white/20 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

// Magnetic hover effect for interactive elements
export function MagneticHover({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for highlighting elements
export function PulseHighlight({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.div
      animate={{
        scale: isActive ? [1, 1.02, 1] : 1,
        boxShadow: isActive 
          ? [
              "0 0 0 0 rgba(139, 92, 246, 0.7)",
              "0 0 0 10px rgba(139, 92, 246, 0)",
              "0 0 0 0 rgba(139, 92, 246, 0)"
            ]
          : "0 0 0 0 rgba(139, 92, 246, 0)"
      }}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
      className="rounded-lg"
    >
      {children}
    </motion.div>
  );
}

// Typing animation for text
export function TypingAnimation({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + currentIndex * 50);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className="relative">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
}

// Morphing icon animation
export function MorphingIcon({ 
  icon1, 
  icon2, 
  isMorphed 
}: { 
  icon1: React.ReactNode; 
  icon2: React.ReactNode; 
  isMorphed: boolean 
}) {
  return (
    <div className="relative w-5 h-5">
      <motion.div
        initial={{ opacity: 1, rotate: 0 }}
        animate={{ 
          opacity: isMorphed ? 0 : 1, 
          rotate: isMorphed ? 90 : 0,
          scale: isMorphed ? 0.8 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {icon1}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ 
          opacity: isMorphed ? 1 : 0, 
          rotate: isMorphed ? 0 : -90,
          scale: isMorphed ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {icon2}
      </motion.div>
    </div>
  );
}

// Stagger animation for lists
export function StaggeredList({ children, stagger = 0.1 }: { children: React.ReactNode[]; stagger?: number }) {
  return (
    <div>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * stagger,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Glowing border animation
export function GlowingBorder({ children, isGlowing }: { children: React.ReactNode; isGlowing: boolean }) {
  return (
    <motion.div
      className="relative rounded-lg"
      animate={{
        boxShadow: isGlowing 
          ? [
              "0 0 5px rgba(139, 92, 246, 0.5)",
              "0 0 20px rgba(139, 92, 246, 0.8)",
              "0 0 5px rgba(139, 92, 246, 0.5)"
            ]
          : "0 0 0 rgba(139, 92, 246, 0)"
      }}
      transition={{
        duration: 2,
        repeat: isGlowing ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}