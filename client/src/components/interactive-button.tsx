import { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveButtonProps {
  text: string;
  fontSize: number;
  fontWeight: number;
  borderStartColor: string;
  borderEndColor: string;
  borderDirection: string;
  textStartColor: string;
  textEndColor: string;
  textDirection: string;
  backgroundStartColor: string;
  backgroundEndColor: string;
  backgroundDirection: string;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  borderWidth: number;
  enable3D: boolean;
  shadowIntensity: number;
  width: number;
  height: number;
  transparentBackground: boolean;
  enableTextShadow?: boolean;
  textShadowColor?: string;
  textShadowX?: number;
  textShadowY?: number;
  textShadowBlur?: number;
  enableBoxShadow?: boolean;
  boxShadowColor?: string;
  boxShadowX?: number;
  boxShadowY?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowInset?: boolean;
  borderStyle?: string;
  className?: string;
}

export function InteractiveButton({
  text,
  fontSize,
  fontWeight,
  borderStartColor,
  borderEndColor,
  borderDirection,
  textStartColor,
  textEndColor,
  textDirection,
  backgroundStartColor,
  backgroundEndColor,
  backgroundDirection,
  paddingX,
  paddingY,
  borderRadius,
  borderWidth,
  enable3D,
  shadowIntensity,
  width,
  height,
  transparentBackground,
  enableTextShadow = false,
  textShadowColor = "#000000",
  textShadowX = 1,
  textShadowY = 1,
  textShadowBlur = 2,
  enableBoxShadow = false,
  boxShadowColor = "#000000",
  boxShadowX = 2,
  boxShadowY = 2,
  boxShadowBlur = 4,
  boxShadowSpread = 0,
  boxShadowInset = false,
  borderStyle = "solid",
  className
}: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const borderGradient = `linear-gradient(${borderDirection}, ${borderStartColor}, ${borderEndColor})`;
  const textGradient = `linear-gradient(${textDirection}, ${textStartColor}, ${textEndColor})`;
  const backgroundGradient = transparentBackground 
    ? 'transparent' 
    : `linear-gradient(${backgroundDirection}, ${backgroundStartColor}, ${backgroundEndColor})`;
  
  // Enhanced hover effects with brick-style press behavior
  const getHoverTransform = () => {
    if (enable3D) {
      // For brick buttons, simulate pressing down into the surface
      if (enableBoxShadow && boxShadowY >= 6) {
        return isPressed ? 'perspective(1000px) rotateX(2deg) scale(0.98) translateY(6px)' : 
               isHovered ? 'perspective(1000px) rotateX(8deg) scale(1.02) translateY(-1px)' : 
               'perspective(1000px) rotateX(5deg)';
      }
      // Default 3D behavior
      return isPressed ? 'perspective(1000px) rotateX(2deg) scale(0.98) translateY(2px)' : 
             isHovered ? 'perspective(1000px) rotateX(8deg) scale(1.02) translateY(-2px)' : 
             'perspective(1000px) rotateX(5deg)';
    }
    return isPressed ? 'scale(0.98) translateY(2px)' : isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)';
  };

  // Enhanced shadow effects with brick-style press behavior
  const getBoxShadow = () => {
    let shadow = 'none';
    
    if (enableBoxShadow) {
      // For brick buttons (identified by large Y offset), create realistic press effect
      if (boxShadowY >= 6) {
        const pressedY = isPressed ? Math.max(1, boxShadowY - 6) : boxShadowY;
        const hoverY = isHovered && !isPressed ? boxShadowY + 2 : pressedY;
        const adjustedBlur = isPressed ? Math.max(0, boxShadowBlur - 2) : boxShadowBlur;
        shadow = `${boxShadowInset ? 'inset ' : ''}${boxShadowX}px ${hoverY}px ${adjustedBlur}px ${boxShadowSpread}px ${boxShadowColor}`;
      } else {
        // Regular box shadow behavior
        const intensity = isPressed ? 0.5 : isHovered ? 1.5 : 1;
        const x = boxShadowX * intensity;
        const y = boxShadowY * intensity;
        const blur = boxShadowBlur * intensity;
        const spread = boxShadowSpread * intensity;
        shadow = `${boxShadowInset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${boxShadowColor}`;
      }
    } else if (enable3D) {
      const intensity = isPressed ? 0.5 : isHovered ? 1.5 : 1;
      const base = shadowIntensity * intensity;
      shadow = `0 ${base}px ${base * 2}px rgba(0, 0, 0, 0.2), 0 ${base * 2}px ${base * 4}px rgba(0, 0, 0, 0.15)`;
    }

    // Add hover glow effect for certain styles
    if (isHovered && (textStartColor.includes('00ff') || borderStartColor.includes('0ea5e9'))) {
      const glowColor = borderStartColor.includes('0ea5e9') ? '#0ea5e9' : textStartColor;
      shadow += shadow !== 'none' ? `, 0 0 20px ${glowColor}` : `0 0 20px ${glowColor}`;
    }

    return shadow;
  };

  // Enhanced text shadow with hover effects
  const getTextShadow = () => {
    if (!enableTextShadow) return 'none';
    const intensity = isHovered ? 1.5 : 1;
    return `${textShadowX * intensity}px ${textShadowY * intensity}px ${textShadowBlur * intensity}px ${textShadowColor}`;
  };

  // Background animation for slide effects
  const getBackgroundStyle = () => {
    if (isHovered && backgroundStartColor !== backgroundEndColor) {
      // Create slide effect by adjusting gradient position
      return `linear-gradient(${backgroundDirection}, ${backgroundEndColor}, ${backgroundStartColor})`;
    }
    return backgroundGradient;
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderRadius: `${borderRadius}px`,
    background: borderGradient,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: getBoxShadow(),
    transform: getHoverTransform(),
    width: `${width}px`,
    height: `${height}px`,
    padding: `${borderWidth}px`,
    userSelect: 'none',
    boxSizing: 'content-box',
  };

  const innerStyle: React.CSSProperties = {
    background: transparentBackground ? 'transparent' : getBackgroundStyle(),
    borderRadius: `${Math.max(0, borderRadius - borderWidth)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: `${paddingY}px ${paddingX}px`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  };

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    backgroundImage: textGradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    margin: 0,
    padding: 0,
    display: 'inline',
    letterSpacing: '0.5px',
    lineHeight: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textShadow: getTextShadow(),
    transition: 'all 0.3s ease',
    transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
  };

  const handleClick = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
  };

  return (
    <div
      className={cn("interactive-button", className)}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
    >
      <div style={innerStyle}>
        {/* Slide overlay effect for modern styles */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: isHovered ? '0%' : '-100%',
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              transition: 'left 0.3s ease',
              zIndex: 1,
            }}
          />
        )}

        {/* Ripple effect */}
        {showRipple && (
          <div
            className="ripple-effect"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              transform: 'translate(-50%, -50%) scale(0)',
              zIndex: 2,
              animation: `ripple-animation 0.6s ease-out`,
            }}
          />
        )}
        
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  );
}