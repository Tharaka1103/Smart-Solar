"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: "square" | "circle" | "triangle";
  delay: number;
  duration: number;
}

interface ConfettiCannonProps {
  autoFire?: boolean;
  intensity?: "low" | "medium" | "high";
  duration?: number;
  colors?: string[];
  onComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ConfettiCannon: React.FC<ConfettiCannonProps> = ({
  autoFire = false,
  intensity = "medium",
  duration = 3000,
  colors = ["#9E7AFF", "#FE8BBB", "#22c55e", "#3b82f6", "#f97316", "#f43f5e"],
  onComplete,
  className,
  children,
}) => {
  const [isActive, setIsActive] = useState(autoFire);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const pieceCount = {
    low: 30,
    medium: 60,
    high: 100,
  }[intensity];

  const generateConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      // Determine if this piece comes from left or right
      const isLeft = i % 2 === 0;
      
      pieces.push({
        id: `confetti-${i}-${Date.now()}`,
        x: isLeft ? 5 : 95, // Start position (slightly inside screen)
        y: 5, // Start from top corners
        rotation: Math.random() * 360,
        scale: Math.random() * 0.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ["square", "circle", "triangle"][Math.floor(Math.random() * 3)] as any,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 2,
      });
    }
    
    return pieces;
  };

  const fireConfetti = () => {
    setIsActive(true);
    setConfetti(generateConfetti());
    
    // Reset after animation completes
    setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, duration);
  };

  useEffect(() => {
    if (autoFire) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        fireConfetti();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFire]);

  const renderShape = (shape: string, color: string) => {
    switch (shape) {
      case "circle":
        return <div className="rounded-full w-full h-full" style={{ backgroundColor: color }} />;
      case "triangle":
        return (
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: `10px solid ${color}`,
            }}
          />
        );
      default:
        return <div className="w-full h-full" style={{ backgroundColor: color }} />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      {children}
      
      {!autoFire && (
        <Button
          onClick={fireConfetti}
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          size="icon"
          variant="outline"
        >
          <PartyPopper className="h-5 w-5" />
        </Button>
      )}

      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {isActive &&
            confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  x: `${piece.x}vw`,
                  y: `${piece.y}vh`,
                  scale: piece.scale,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${piece.x + (piece.x < 50 ? Math.random() * 40 + 10 : -(Math.random() * 40 + 10))}vw`,
                  y: `${80 + Math.random() * 20}vh`,
                  rotate: piece.rotation * (Math.random() > 0.5 ? 1 : -1),
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 40,
                  duration: piece.duration,
                  delay: piece.delay,
                }}
                className="absolute w-4 h-4"
                style={{ transformOrigin: "center center" }}
              >
                {renderShape(piece.shape, piece.color)}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConfettiCannon;
