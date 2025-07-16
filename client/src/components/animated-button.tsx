import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  animationType?: 'glow' | 'pulse' | 'bounce' | 'slide';
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AnimatedButton({
  children,
  className,
  isLoading = false,
  animationType = 'glow',
  icon,
  variant = 'default',
  size = 'default',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const animationClasses = {
    glow: 'hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300',
    pulse: 'hover:animate-pulse transition-all duration-300',
    bounce: 'hover:animate-bounce transition-all duration-300',
    slide: 'hover:translate-x-1 transition-transform duration-300',
  };

  return (
    <Button
      className={cn(
        'relative overflow-hidden',
        animationClasses[animationType],
        className
      )}
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </Button>
  );
}