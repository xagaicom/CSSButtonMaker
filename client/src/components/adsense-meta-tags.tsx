import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface AdSenseVerification {
  code: string;
  method: "adsense_code" | "ads_txt" | "meta_tag";
  isActive: boolean;
}

export function AdSenseMetaTags() {
  // Fetch current verification settings from public endpoint
  const { data: verification } = useQuery<AdSenseVerification | null>({
    queryKey: ['/api/adsense-verification'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  useEffect(() => {
    // Remove any existing AdSense verification meta tags
    const existingMetaTags = document.querySelectorAll('meta[name="google-adsense-account"], meta[name="google-site-verification"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Always add the AdSense account meta tag (hardcoded for reliability)
    const adsenseMetaTag = document.createElement('meta');
    adsenseMetaTag.setAttribute('name', 'google-adsense-account');
    adsenseMetaTag.setAttribute('content', 'ca-pub-5184021631989355');
    document.head.appendChild(adsenseMetaTag);

    // Also add dynamic verification if it exists and is active
    if (verification && verification.isActive && verification.method === 'meta_tag' && verification.code) {
      const metaTag = document.createElement('meta');
      
      // Determine if it's a Google AdSense account verification or site verification
      if (verification.code.includes('ca-pub-')) {
        metaTag.setAttribute('name', 'google-adsense-account');
        metaTag.setAttribute('content', verification.code);
      } else {
        metaTag.setAttribute('name', 'google-site-verification');
        metaTag.setAttribute('content', verification.code);
      }
      
      // Add to document head
      document.head.appendChild(metaTag);
    }
  }, [verification]);

  // This component doesn't render anything visible
  return null;
}