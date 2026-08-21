import { UE, SEC_LINK_DOT } from "@/components/ue-editor/ue-theme";

/**
 * The two labels a chain wire's dot takes, drawn with the colors
 * SEdNode_SECGraphLinkDot.cpp paints it. Which label appears follows
 * GetLinkGlyphText() in SECActionSetBinding.cpp: a double arrow for an
 * Immediate link, the bonus multiplier for anything else.
 */

type DotForm = {
  glyph: string;
  pacing: string;
  meaning: string;
  detail: string;
};

const FORMS: DotForm[] = [
  {
    glyph: "x1.5",
    pacing: "Score Only",
    meaning: "Bonus only",
    detail: "The follow-up's score is multiplied while the window is open, and it waits out the recovery breather like any other action.",
  },
  {
    glyph: "»",
    pacing: "Immediate",
    meaning: "No recovery wait",
    detail: "The follow-up starts the moment the first action ends, so a combo runs straight through the breather that would otherwise hold it.",
  },
];

export default function ChainLinkDotLegend() {
  return (
    <div className="my-6 overflow-x-auto">
      <div
        className="min-w-[540px] rounded-sm border p-3"
        style={{ background: UE.panel, borderColor: UE.windowBorder }}
      >
        <div className="flex flex-col gap-3">
          {FORMS.map((form) => (
            <div key={form.pacing} className="flex items-start gap-3">
              <div className="flex w-[104px] shrink-0 items-center justify-center">
                <span
                  className="flex items-center justify-center rounded-sm px-2 font-bold leading-none"
                  style={{
                    background: SEC_LINK_DOT.idle,
                    color: SEC_LINK_DOT.glyph,
                    fontSize: 14.3,
                    minWidth: 48,
                    height: 26,
                  }}
                >
                  {form.glyph}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: UE.foregroundHeader }}>
                  {form.meaning}
                  <span className="ml-2 font-normal" style={{ color: SEC_LINK_DOT.hovered }}>
                    Pacing: {form.pacing}
                  </span>
                </div>
                <div className="text-[12px] leading-snug" style={{ color: UE.foreground }}>
                  {form.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
