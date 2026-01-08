import React from 'react';

interface BlueprintUEProps {
  id: string; // The unique ID from blueprintue.com (e.g., "x_yz123")
  title?: string;
  height?: string;
  zoom?: number;
}

export const BlueprintUE: React.FC<BlueprintUEProps> = ({ id, title = "Blueprint", height = "400px", zoom = -6 }) => {
  const embedUrl = `https://blueprintue.com/render/${id}/?zoom=${zoom}`;

  return (
    <div className="my-6 border rounded-lg overflow-hidden bg-[#1a1a1a] shadow-md">
      {/* Optional Header for context */}
      <div className="bg-[#2a2a2a] px-4 py-2 border-b border-[#333] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#00A2FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" />
            <path d="M10,17L15,12L10,7V17Z" fill="white" />
          </svg>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Blueprint</span>
        </div>
        <a
          href={embedUrl.replace("render", "blueprint")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#00A2FF] hover:underline"
        >
          Open in blueprintue.com ↗
        </a>
      </div>

      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        scrolling="no"
        allowFullScreen
        className="block border-0"
        title={title}
      />
    </div>
  );
};

export default BlueprintUE;
