import React from 'react';
import { UePanel } from '@/components/ue-editor';

interface BlueprintUEProps {
  id: string; // The unique ID from blueprintue.com (e.g., "x_yz123")
  title?: string;
  height?: string;
  zoom?: number;
}

export const BlueprintUE: React.FC<BlueprintUEProps> = ({ id, title = "Blueprint", height = "400px", zoom = -6 }) => {
  const embedUrl = `https://blueprintue.com/render/${id}/?zoom=${zoom}`;

  return (
    <UePanel
      title={title}
      breadcrumb={["Content", "Blueprints"]}
      assetType="blueprint"
      headerRight={
        <a
          href={embedUrl.replace("render", "blueprint")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-[#00A2FF] hover:underline"
        >
          Open in blueprintue.com ↗
        </a>
      }
      bodyClassName="p-0"
    >
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        scrolling="no"
        allowFullScreen
        className="block border-0"
        title={title}
      />
    </UePanel>
  );
};

export default BlueprintUE;
