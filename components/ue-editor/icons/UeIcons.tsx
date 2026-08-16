import { UE, UE_KIT } from "../ue-theme";

/**
 * UE 5.8 Starship editor icons.
 * Registered in Engine/Source/Editor/EditorStyle/Private/StarshipStyle.cpp
 *   SCS.Component → Starship/AssetIcons/ActorComponent_16
 */
export function UeActorComponentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      {/* C-notch on left — matches ActorComponent_16 */}
      <path
        fill={UE.foreground}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2H14V14H4V10H8V6H4V2Z"
      />
    </svg>
  );
}

export function UeSceneComponentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="2" width="12" height="12" rx="1" fill={UE.hover2} />
      <path d="M8 2V14M2 8H14" stroke={UE.foreground} strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1.5" fill={UE.foreground} />
    </svg>
  );
}

export function UeDataAssetThumbnailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="26" fill={UE.dropdownOutline} />
      <path d="M32 6 A26 26 0 0 1 54 38 L32 32 Z" fill={UE.hover2} />
      <path d="M32 32 L54 38 A26 26 0 0 1 32 58 Z" fill={UE.hover} />
      <circle cx="32" cy="32" r="26" stroke={UE.hover2} strokeWidth="1" fill="none" />
    </svg>
  );
}

export function UeBlueprintThumbnailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="10" width="44" height="44" rx="2" fill={UE.secondary} stroke={UE.hover} strokeWidth="1" />
      <path d="M26 20 L46 32 L26 44 Z" fill={UE.blueprint} />
    </svg>
  );
}

export function UeFolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 52" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ue-folder-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UE_KIT.folderTabTop} />
          <stop offset="100%" stopColor={UE_KIT.folderTabBottom} />
        </linearGradient>
        <linearGradient id="ue-folder-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UE_KIT.folderTop} />
          <stop offset="100%" stopColor={UE_KIT.folderBottom} />
        </linearGradient>
      </defs>
      <path d="M0 10 H24 L28 4 H64 V48 H0 Z" fill="url(#ue-folder-body)" />
      <path d="M0 4 H24 V10 H0 Z" fill="url(#ue-folder-top)" />
    </svg>
  );
}
