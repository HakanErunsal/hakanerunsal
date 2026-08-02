import { UE } from "@/components/ue-editor/ue-theme";

/**
 * The order a Defense component walks its responses in, from the most situational to the
 * most general. Matches USECDefenseComponent::GetEffectiveResponses: carried sets first,
 * then the component's own Responses, then the Defense Set.
 */

type Band = {
  index: string;
  title: string;
  source: string;
  detail: string;
  accent: string;
};

const BANDS: Band[] = [
  {
    index: "1",
    title: "What the pawn is carrying",
    source: "Weapon Defense Set on each held item, gathered through Get Defense Sets",
    detail:
      "Runs in the order the items were equipped, and stops the moment an item is put down. A shield in the off hand contributes alongside the sword.",
    accent: UE.dataAsset,
  },
  {
    index: "2",
    title: "Responses on the component",
    source: "SEC Defense > Responses",
    detail:
      "The pawn's own answers: its dodge frames, its parry, its stance. Authored on the pawn, so they hold whatever it is holding.",
    accent: UE.primary,
  },
  {
    index: "3",
    title: "The shared set",
    source: "SEC Defense > Defense Set",
    detail:
      "A Defense Rule Set several characters point at. Last in the walk, so a broad resistance here trims whatever the answers above it let through.",
    accent: UE.accentFolder,
  },
];

export default function DefenseResponseOrder() {
  return (
    <div className="my-6 overflow-x-auto">
      <div
        className="min-w-[520px] rounded-sm border p-3"
        style={{ background: UE.panel, borderColor: UE.windowBorder }}
      >
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide" style={{ color: UE.hover2 }}>
          <span>Most situational first</span>
          <span>A hit enters at the top</span>
        </div>

        <div className="flex flex-col gap-2">
          {BANDS.map((band) => (
            <div
              key={band.index}
              className="flex items-start gap-3 rounded-sm border-l-2 p-2"
              style={{ background: UE.recessed, borderLeftColor: band.accent }}
            >
              <div
                className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[11px] font-bold"
                style={{ background: band.accent, color: UE.background }}
              >
                {band.index}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: UE.foregroundHeader }}>
                  {band.title}
                </div>
                <div className="font-mono text-[11px]" style={{ color: UE.hover2 }}>
                  {band.source}
                </div>
                <div className="mt-1 text-[12px] leading-snug" style={{ color: UE.foreground }}>
                  {band.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-3 rounded-sm border-t px-1 pt-2 text-[12px] leading-snug"
          style={{ borderColor: UE.windowBorder, color: UE.foreground }}
        >
          The first response that answers the hit ends the walk. Tick{" "}
          <span className="font-mono" style={{ color: UE.foregroundHeader }}>
            Continue After Claim
          </span>{" "}
          on a response and the ones below it keep shaving what is left, which is what armour wants and a parry does not.
        </div>
      </div>
    </div>
  );
}
