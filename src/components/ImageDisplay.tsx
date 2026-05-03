import { useMemo, useState } from 'react';

type ImageDisplayProps = {
  activeTab: string;
  subId?: string;
};

// Placeholder image generation component.
// In the future, nanobanana-generated WebP images will be placed in public/images/ and loaded here.
export const ImageDisplay = ({ activeTab, subId }: ImageDisplayProps) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = useMemo(() => {
    setHasError(false); // Reset error state when tab or subId changes
    // Mapping for tabs to background images
    const map: Record<string, string> = {
      dashboard: 'bg_dashboard',
      board: 'bg_board',
      dungeons: 'bg_dungeons',
      adventurers: 'bg_adventurers',
      policy: 'bg_policy',
      facilities: 'bg_facilities',
      shops: 'bg_shops',
      intrigue: 'bg_intrigue',
      darkmarket: 'bg_darkmarket',
      records: 'bg_records',
      skills: 'bg_skills',
    };

    // Special sub-mappings (e.g., for facilities)
    const subMap: Record<string, string> = {
      dorm: 'bg_fac_barracks',
      tavern: 'bg_fac_tavern',
      training: 'bg_fac_training',
    };

    const imgName = (activeTab === 'facilities' && subId && subMap[subId]) 
      ? subMap[subId] 
      : (map[activeTab] || 'bg_dashboard');

    return `${import.meta.env.BASE_URL}images/${imgName}.webp`;
  }, [activeTab, subId]);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border-2 border-gray-600 shadow-xl bg-gray-900 flex items-center justify-center">
      {/* Fallback styling for when images aren't generated yet */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
      <img
        src={imageUrl}
        alt={`Scene for ${activeTab}`}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="z-20 text-center space-y-2">
          {/* Placeholder text if image fails to load */}
          <span className="text-gray-500 italic text-sm block">Image placeholder</span>
          <span className="text-gray-600 text-xs block">nanobanana: generate "{activeTab} fantasy background"</span>
        </div>
      )}
    </div>
  );
};
