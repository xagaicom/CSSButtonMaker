import { cn } from "@/lib/utils";

interface GradientButtonProps {
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
  // Text Shadow
  enableTextShadow?: boolean;
  textShadowColor?: string;
  textShadowX?: number;
  textShadowY?: number;
  textShadowBlur?: number;
  // Box Shadow
  enableBoxShadow?: boolean;
  boxShadowColor?: string;
  boxShadowX?: number;
  boxShadowY?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowInset?: boolean;
  // Border Style
  borderStyle?: string;
  className?: string;
}

export function GradientButton({
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
}: GradientButtonProps) {
  const borderGradient = `linear-gradient(${borderDirection}, ${borderStartColor}, ${borderEndColor})`;
  const textGradient = `linear-gradient(${textDirection}, ${textStartColor}, ${textEndColor})`;
  const backgroundGradient = transparentBackground 
    ? 'transparent' 
    : `linear-gradient(${backgroundDirection}, ${backgroundStartColor}, ${backgroundEndColor})`;
  
  // Calculate box shadow
  let boxShadowValue = 'none';
  if (enableBoxShadow) {
    boxShadowValue = `${boxShadowInset ? 'inset ' : ''}${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowSpread}px ${boxShadowColor}`;
  } else if (enable3D) {
    boxShadowValue = `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, 0.2), 0 ${shadowIntensity * 2}px ${shadowIntensity * 4}px rgba(0, 0, 0, 0.15)`;
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderRadius: `${borderRadius}px`,
    background: borderGradient,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: boxShadowValue,
    transform: enable3D ? 'perspective(1000px) rotateX(5deg)' : 'none',
    width: `${width}px`,
    height: `${height}px`,
    padding: `${borderWidth}px`,
    boxSizing: 'content-box',
  };

  const innerStyle: React.CSSProperties = {
    background: backgroundGradient,
    borderRadius: `${Math.max(0, borderRadius - borderWidth)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: `${paddingY}px ${paddingX}px`,
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
    textShadow: enableTextShadow ? `${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor}` : 'none',
  };

  return (
    <div
      className={cn("gradient-button", className)}
      style={containerStyle}
    >
      <div className="button-inner" style={innerStyle}>
        <span className="button-text" style={textStyle}>
          {text}
        </span>
      </div>
    </div>
  );
}