import { useQuery } from "@tanstack/react-query";
import { AdSpace as AdSpaceType } from "@shared/schema";

interface AdSpaceProps {
  location: string;
  className?: string;
}

interface AdPlaceholderProps {
  size: string;
  type: string;
  className?: string;
}

// Placeholder component for when no ads are available
function AdPlaceholder({ size, type, className = "" }: AdPlaceholderProps) {
  const sizeClass = {
    "728x90": "w-[728px] h-[90px]",
    "300x250": "w-[300px] h-[250px]",
    "320x50": "w-[320px] h-[50px]",
    "250x250": "w-[250px] h-[250px]",
  }[size] || "w-[300px] h-[250px]";

  return (
    <div 
      className={`
        ${sizeClass} 
        border-2 border-dashed border-gray-300 
        bg-gray-50 
        flex items-center justify-center 
        text-gray-400 text-sm 
        ${className}
      `}
    >
      <div className="text-center">
        <div className="font-medium">{type} Ad</div>
        <div className="text-xs">{size}</div>
      </div>
    </div>
  );
}

export function AdSpace({ location, className = "" }: AdSpaceProps) {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: [`/api/ad-spaces/location/${location}`],
    retry: false,
  });

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  }

  if (!ads || ads.length === 0) {
    return null; // Return nothing if no ads configured for this location
  }

  return (
    <div className={`ad-space-container ${className}`}>
      {ads.map((ad: AdSpaceType) => (
        <div key={ad.id} className="ad-space-item mb-4">
          {ad.adCode ? (
            <div
              className="ad-content"
              dangerouslySetInnerHTML={{ __html: ad.adCode }}
            />
          ) : (
            <AdPlaceholder 
              size={ad.adSize}
              type={ad.adType}
              className="mx-auto"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Specific ad components for each location
export function HeaderBannerAd({ className = "" }: { className?: string }) {
  return <AdSpace location="header" className={className} />;
}

export function LeftSidebarAd({ className = "" }: { className?: string }) {
  return <AdSpace location="left-sidebar" className={className} />;
}

export function RightSidebarAd({ className = "" }: { className?: string }) {
  return <AdSpace location="right-sidebar" className={className} />;
}

export function CSSOutputAd({ className = "" }: { className?: string }) {
  return <AdSpace location="css-output" className={className} />;
}

export function ModalAd({ className = "" }: { className?: string }) {
  return <AdSpace location="modal" className={className} />;
}