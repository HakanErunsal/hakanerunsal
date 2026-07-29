"use client"

import { useEffect, useState } from 'react';
import { Check, Layers } from 'lucide-react';
import {
  UePanel,
  UeContentBrowserTile,
  UeDetailsSection,
  UePropertyRow,
  UeAssetPicker,
  UeAssetThumbnail,
  getAssetAccent,
} from '@/components/ue-editor';
import { cn } from '@/lib/utils';

type Stage = 0 | 1 | 2 | 3 | 4 | 5;

export default function ScorerStackVisualizer() {
    const [stage, setStage] = useState<Stage>(0);
    const [customNamed, setCustomNamed] = useState(false);

    useEffect(() => {
        let mounted = true;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const run = async () => {
            while (mounted) {
                setCustomNamed(false);
                setStage(0); await wait(1700);
                setStage(1); await wait(1500);
                setStage(2); await wait(1500);
                setStage(3); await wait(700);
                if (!mounted) break;
                setCustomNamed(true); await wait(1300);
                setStage(4); await wait(1800);
                setStage(5); await wait(1700);
            }
        };

        run();
        return () => { mounted = false; };
    }, []);

    const distanceShown = stage >= 1;
    const gateShown = stage >= 2;
    const customInList = stage >= 4;
    const customOnRight = stage === 3 || stage === 4;

    return (
        <UePanel
            title="Content Browser"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat", "ActionSets"]}
            assetType="dataAsset"
            caption={<>Each scorer multiplies in; each gate can veto. Mix built-ins with custom subclasses.</>}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                {/* Details panel — scoring list as property rows */}
                <div className="min-w-0 flex-1 overflow-hidden rounded-[2px] border border-[#111111]">
                    <div className="flex items-center gap-1.5 border-b border-[#111111] bg-[#1a1a1a] px-2 py-1 text-[11px] text-[#cccccc]">
                        <Layers className="h-3 w-3 text-[#888888]" />
                        Scoring list
                    </div>

                    <UeDetailsSection className="relative" title="Action Scorers">
                        <UePropertyRow label="SelectionWeight">
                            <UeAssetPicker value="Always present · × base" />
                        </UePropertyRow>

                        <div className={cn(
                            "transition-all duration-700",
                            distanceShown ? "opacity-100" : "invisible opacity-0",
                        )}>
                            <UePropertyRow label="Distance Scorer">
                                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                    <UeAssetThumbnail accent={getAssetAccent("dataAsset")} />
                                    <UeAssetPicker value="Distance Scorer · × range" />
                                </div>
                            </UePropertyRow>
                        </div>

                        <div className={cn(
                            "transition-all duration-700",
                            gateShown ? "opacity-100" : "invisible opacity-0",
                        )}>
                            <UePropertyRow label="Stamina Gate">
                                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                    <UeAssetThumbnail accent="#FFB800" />
                                    <UeAssetPicker value="Stamina Gate · pass / fail" />
                                </div>
                            </UePropertyRow>
                        </div>

                        <div className={cn(
                            "transition-all duration-700",
                            customInList ? "opacity-100" : "invisible opacity-0",
                        )}>
                            <UePropertyRow label="Ally-Count Scorer">
                                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                    <UeAssetThumbnail accent="#A070FF" />
                                    <UeAssetPicker value="Ally-Count Scorer · × your rule" />
                                </div>
                            </UePropertyRow>
                        </div>

                        <div className={cn(
                            "pointer-events-none absolute inset-x-0 bottom-0 top-8 flex items-center justify-center px-2 text-center text-[10px] italic text-[#666666] transition-opacity duration-700",
                            stage === 0 ? "opacity-100" : "opacity-0",
                        )}>
                            No scorers or gates, so the action scores on weight alone.
                        </div>
                    </UeDetailsSection>

                    {/* Live formula bar */}
                    <div className="border-t border-[#111111] bg-[#151515] px-2 py-2 font-mono text-[10px] text-[#888888]">
                        score = <span className="text-[#cccccc]">Weight</span>
                        <span className={cn("transition-opacity", distanceShown ? "text-[#34a8ff] opacity-100" : "opacity-25")}> × Distance</span>
                        <span className={cn("transition-opacity", gateShown ? "text-[#FFB800] opacity-100" : "opacity-25")}> · (Stamina pass)</span>
                        <span className={cn("transition-opacity", customInList ? "text-[#C71585] opacity-100" : "opacity-25")}> × Yours</span>
                    </div>
                </div>

                {/* Content Browser grid — library tiles */}
                <div className="shrink-0 lg:w-[240px]">
                    <div className="mb-2 text-[10px] text-[#666666]">Add from library</div>
                    <div className="flex flex-wrap gap-2">
                        <UeContentBrowserTile
                            name="Distance Scorer"
                            assetType="dataAsset"
                            typeLabel="Data Asset (Scorer)"
                            active={stage === 1}
                            faded={stage > 1}
                        />
                        <UeContentBrowserTile
                            name="Stamina Gate"
                            assetType="dataAsset"
                            typeLabel="Data Asset (Gate)"
                            active={stage === 2}
                            faded={stage > 2}
                        />
                        <UeContentBrowserTile
                            name={customOnRight ? (customNamed ? "Ally-Count Scorer" : "New Scorer") : "Create custom"}
                            assetType="blueprint"
                            typeLabel="Blueprint (USECScorer)"
                            active={customOnRight}
                            faded={stage === 4}
                        />
                    </div>

                    <div className="mt-3 flex min-h-[54px] flex-col gap-1">
                        {stage > 1 && (
                            <div className="flex items-center gap-1 text-[10px] text-[#666666]">
                                <Check className="h-3 w-3 text-[#6CC644]" /> Distance Scorer added
                            </div>
                        )}
                        {stage > 2 && (
                            <div className="flex items-center gap-1 text-[10px] text-[#666666]">
                                <Check className="h-3 w-3 text-[#6CC644]" /> Stamina Gate added
                            </div>
                        )}
                        {customInList && (
                            <div className="flex items-center gap-1 text-[10px] text-[#666666]">
                                <Check className="h-3 w-3 text-[#6CC644]" /> Custom scorer added
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UePanel>
    );
}
