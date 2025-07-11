import React from 'react';

interface AdvancedButtonProps {
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
  // Advanced CSS Properties
  enableAdvancedCSS?: boolean;
  customCSS?: string;
  // Hover Effects
  enableHoverEffects?: boolean;
  hoverScale?: number;
  hoverRotate?: number;
  hoverSkew?: number;
  hoverBrightness?: number;
  // Animation Properties
  enableAnimation?: boolean;
  animationType?: string;
  animationDuration?: number;
  animationDelay?: number;
  animationIterations?: string;
  // Transform Properties
  enableTransform?: boolean;
  transformOrigin?: string;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  // Transition Properties
  enableTransition?: boolean;
  transitionProperty?: string;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  transitionDelay?: number;
  // Pseudo Elements
  enableBeforeElement?: boolean;
  beforeContent?: string;
  beforeWidth?: number;
  beforeHeight?: number;
  beforeBackground?: string;
  beforePosition?: string;
  beforeTop?: number;
  beforeLeft?: number;
  enableAfterElement?: boolean;
  afterContent?: string;
  afterWidth?: number;
  afterHeight?: number;
  afterBackground?: string;
  afterPosition?: string;
  afterTop?: number;
  afterLeft?: number;
  // Advanced Effects
  enableClipPath?: boolean;
  clipPath?: string;
  enableBackdropFilter?: boolean;
  backdropFilter?: string;
  enableMixBlendMode?: boolean;
  mixBlendMode?: string;
  // Custom Properties
  enableCustomProperties?: boolean;
  customProperties?: string;
  className?: string;
}

export function AdvancedButton({
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
  // Advanced CSS Properties
  enableAdvancedCSS = false,
  customCSS = "",
  // Hover Effects
  enableHoverEffects = false,
  hoverScale = 1.05,
  hoverRotate = 0,
  hoverSkew = 0,
  hoverBrightness = 1,
  // Animation Properties
  enableAnimation = false,
  animationType = "none",
  animationDuration = 0.3,
  animationDelay = 0,
  animationIterations = "1",
  // Transform Properties
  enableTransform = false,
  transformOrigin = "center",
  perspective = 1000,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  // Transition Properties
  enableTransition = true,
  transitionProperty = "all",
  transitionDuration = 0.3,
  transitionTimingFunction = "ease",
  transitionDelay = 0,
  // Pseudo Elements
  enableBeforeElement = false,
  beforeContent = "",
  beforeWidth = 100,
  beforeHeight = 100,
  beforeBackground = "#ffffff",
  beforePosition = "absolute",
  beforeTop = 0,
  beforeLeft = 0,
  enableAfterElement = false,
  afterContent = "",
  afterWidth = 100,
  afterHeight = 100,
  afterBackground = "#ffffff",
  afterPosition = "absolute",
  afterTop = 0,
  afterLeft = 0,
  // Advanced Effects
  enableClipPath = false,
  clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  enableBackdropFilter = false,
  backdropFilter = "blur(10px)",
  enableMixBlendMode = false,
  mixBlendMode = "normal",
  // Custom Properties
  enableCustomProperties = false,
  customProperties = "",
  className = "",
}: AdvancedButtonProps) {
  
  // Generate gradients
  const backgroundGradient = transparentBackground
    ? 'transparent'
    : backgroundStartColor === backgroundEndColor
    ? backgroundStartColor
    : `linear-gradient(${backgroundDirection}, ${backgroundStartColor}, ${backgroundEndColor})`;
  
  const borderGradient = borderStartColor === borderEndColor
    ? borderStartColor
    : `linear-gradient(${borderDirection}, ${borderStartColor}, ${borderEndColor})`;
  
  const textGradient = textStartColor === textEndColor
    ? textStartColor
    : `linear-gradient(${textDirection}, ${textStartColor}, ${textEndColor})`;

  // Build transforms
  const transforms = [];
  if (enableTransform) {
    if (rotateX !== 0) transforms.push(`rotateX(${rotateX}deg)`);
    if (rotateY !== 0) transforms.push(`rotateY(${rotateY}deg)`);
    if (rotateZ !== 0) transforms.push(`rotateZ(${rotateZ}deg)`);
    if (perspective !== 1000) transforms.push(`perspective(${perspective}px)`);
  }
  
  const transformString = transforms.length > 0 ? transforms.join(' ') : 'none';

  // Build hover transforms
  const hoverTransforms = [];
  if (enableHoverEffects) {
    if (hoverScale !== 1) hoverTransforms.push(`scale(${hoverScale})`);
    if (hoverRotate !== 0) hoverTransforms.push(`rotate(${hoverRotate}deg)`);
    if (hoverSkew !== 0) hoverTransforms.push(`skew(${hoverSkew}deg)`);
  }
  const hoverTransformString = hoverTransforms.length > 0 ? hoverTransforms.join(' ') : 'none';

  // Generate unique ID for this button instance
  const buttonId = React.useMemo(() => `btn-${Math.random().toString(36).substr(2, 9)}`, []);

  // Build animation keyframes
  const animationKeyframes = React.useMemo(() => {
    switch (animationType) {
      case 'pulse':
        return `@keyframes pulse-${buttonId} {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }`;
      case 'bounce':
        return `@keyframes bounce-${buttonId} {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }`;
      case 'wobble':
        return `@keyframes wobble-${buttonId} {
          0% { transform: translateX(0%); }
          15% { transform: translateX(-25%) rotate(-5deg); }
          30% { transform: translateX(20%) rotate(3deg); }
          45% { transform: translateX(-15%) rotate(-3deg); }
          60% { transform: translateX(10%) rotate(2deg); }
          75% { transform: translateX(-5%) rotate(-1deg); }
          100% { transform: translateX(0%); }
        }`;
      case 'fadeIn':
        return `@keyframes fadeIn-${buttonId} {
          from { opacity: 0; }
          to { opacity: 1; }
        }`;
      case 'slideIn':
        return `@keyframes slideIn-${buttonId} {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }`;
      case 'rotate':
        return `@keyframes rotate-${buttonId} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }`;
      default:
        return '';
    }
  }, [animationType, buttonId]);

  const animationValue = enableAnimation && animationType !== 'none'
    ? `${animationType}-${buttonId} ${animationDuration}s ${transitionTimingFunction} ${animationDelay}s ${animationIterations}`
    : 'none';

  // Generate the complete CSS
  const buttonCSS = `
    ${animationKeyframes}
    ${enableCustomProperties ? customProperties : ''}
    
    .${buttonId} {
      position: relative;
      display: inline-block;
      cursor: pointer;
      border: none;
      outline: none;
      font-family: inherit;
      overflow: hidden;
      z-index: 1;
      
      width: ${width}px;
      height: ${height}px;
      font-size: ${fontSize}px;
      font-weight: ${fontWeight};
      padding: ${paddingY}px ${paddingX}px;
      border-radius: ${borderRadius}px;
      
      background: ${backgroundGradient};
      border: ${borderWidth}px ${borderStyle} transparent;
      ${borderWidth > 0 ? `background-clip: padding-box; border-image: ${borderGradient} 1;` : ''}
      
      color: ${textStartColor === textEndColor ? textStartColor : 'transparent'};
      ${textStartColor !== textEndColor ? `background-image: ${textGradient}; -webkit-background-clip: text; background-clip: text;` : ''}
      
      ${enableTextShadow ? `text-shadow: ${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor};` : ''}
      
      ${enableBoxShadow ? `box-shadow: ${boxShadowInset ? 'inset ' : ''}${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowSpread}px ${boxShadowColor};` : ''}
      
      ${enable3D ? `transform: perspective(100px) rotateX(10deg); box-shadow: 0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,0.3);` : ''}
      
      ${enableTransform ? `transform-origin: ${transformOrigin}; transform: ${transformString};` : ''}
      
      ${enableTransition ? `transition: ${transitionProperty} ${transitionDuration}s ${transitionTimingFunction} ${transitionDelay}s;` : ''}
      
      ${enableAnimation ? `animation: ${animationValue};` : ''}
      
      ${enableClipPath ? `clip-path: ${clipPath};` : ''}
      
      ${enableBackdropFilter ? `backdrop-filter: ${backdropFilter};` : ''}
      
      ${enableMixBlendMode ? `mix-blend-mode: ${mixBlendMode};` : ''}
      
      ${enableAdvancedCSS ? customCSS : ''}
    }
    
    ${enableBeforeElement ? `
    .${buttonId}::before {
      content: "${beforeContent}";
      position: ${beforePosition};
      top: ${beforeTop}px;
      left: ${beforeLeft}px;
      width: ${beforeWidth}%;
      height: ${beforeHeight}%;
      background: ${beforeBackground};
      z-index: -1;
      transition: inherit;
    }` : ''}
    
    ${enableAfterElement ? `
    .${buttonId}::after {
      content: "${afterContent}";
      position: ${afterPosition};
      top: ${afterTop}px;
      left: ${afterLeft}px;
      width: ${afterWidth}%;
      height: ${afterHeight}%;
      background: ${afterBackground};
      z-index: -1;
      transition: inherit;
    }` : ''}
    
    .${buttonId}:hover {
      ${enableHoverEffects ? `
        transform: ${hoverTransformString};
        filter: brightness(${hoverBrightness});
      ` : ''}
    }
    
    .${buttonId}:active {
      ${enable3D ? 'transform: perspective(100px) rotateX(10deg) translateY(2px); box-shadow: 0 2px 4px rgba(0,0,0,0.2);' : ''}
    }
  `;

  return (
    <div>
      <style>{buttonCSS}</style>
      <button className={`${buttonId} ${className}`}>
        {text}
      </button>
    </div>
  );
}