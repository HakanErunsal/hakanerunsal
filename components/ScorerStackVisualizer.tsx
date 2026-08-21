"use client"

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import {
    UE,
    UePanel,
    UeDetailsSection,
    UePropertyRow,
} from '@/components/ue-editor';
import { cn } from '@/lib/utils';

/**
 * An action's Scoring group filling up, live.
 *
 * Scorers and Gates are Instanced object arrays on FSECCustomScoring, so an entry
 * arrives by adding an array element and picking a class in that element's combo.
 * The list on the right is that class picker: the built-in classes, plus a
 * Blueprint subclass of SEC Scorer once one exists in the project.
 */

type Stage = 0 | 1 | 2 | 3 | 4 | 5;

const SCORER_CLASSES = ["Angle Scorer", "Attribute Scorer", "Distance Scorer", "Health Scorer", "Speed Scorer", "Vital Scorer"];
const GATE_CLASSES = ["Attribute Gate", "Combat Token Gate", "Stamina Gate", "Vital Gate"];
const CUSTOM_CLASS = "BP_AllyCountScorer";

/** Details panel value cell for an array element's class combo. */
function ClassCombo({ value }: { value: string }) {
    return (
        <div className="ue-dp-combo flex items-center justify-between gap-1 pl-1.5 pr-1">
            <span className="truncate text-[13px] leading-[21px]" style={{ color: UE.foregroundHeader }}>{value}</span>
            <svg className="h-2.5 w-2.5 shrink-0" style={{ color: UE.hover2 }} viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                <path d="M1 3 L9 3 L5 8 Z" />
            </svg>
        </div>
    );
}

/** Details panel value cell for a plain number or count. */
function TextValue({ children }: { children: React.ReactNode }) {
    return <span className="text-[13px]" style={{ color: UE.foregroundHeader }}>{children}</span>;
}

export default function ScorerStackVisualizer() {
    const [stage, setStage] = useState<Stage>(0);

    useEffect(() => {
        let mounted = true;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const run = async () => {
            while (mounted) {
                setStage(0); await wait(1700);
                setStage(1); await wait(1700);
                setStage(2); await wait(1700);
                setStage(3); await wait(1500);
                setStage(4); await wait(1800);
                setStage(5); await wait(1700);
            }
        };

        run();
        return () => { mounted = false; };
    }, []);

    const distanceShown = stage >= 1;
    const gateShown = stage >= 2;
    const customShown = stage >= 4;

    const pickingGate = stage === 2;
    const pickerOptions = pickingGate
        ? GATE_CLASSES
        : stage >= 3
            ? [...SCORER_CLASSES, CUSTOM_CLASS]
            : SCORER_CLASSES;
    const picked = pickingGate ? "Stamina Gate" : stage === 1 ? "Distance Scorer" : stage >= 3 ? CUSTOM_CLASS : null;

    return (
        <UePanel
            title="Details"
            showTitleIcon={false}
            caption={<>Each scorer multiplies in; each gate can veto. Mix built-ins with Blueprint subclasses of your own.</>}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                <div
                    className="min-w-0 flex-1 overflow-hidden rounded-[2px] border"
                    style={{ borderColor: UE.windowBorder, background: UE.background }}
                >
                    <UeDetailsSection className="relative" title="Scoring">
                        <UePropertyRow label="Selection Weight">
                            <TextValue>1.0</TextValue>
                        </UePropertyRow>

                        <UePropertyRow label="Scorers">
                            <TextValue>{(distanceShown ? 1 : 0) + (customShown ? 1 : 0)} Array elements</TextValue>
                        </UePropertyRow>

                        <div className={cn("transition-all duration-700", distanceShown ? "opacity-100" : "invisible opacity-0")}>
                            <UePropertyRow label="Index [ 0 ]">
                                <ClassCombo value="Distance Scorer" />
                            </UePropertyRow>
                        </div>

                        <div className={cn("transition-all duration-700", customShown ? "opacity-100" : "invisible opacity-0")}>
                            <UePropertyRow label="Index [ 1 ]">
                                <ClassCombo value={CUSTOM_CLASS} />
                            </UePropertyRow>
                        </div>

                        <UePropertyRow label="Gates">
                            <TextValue>{gateShown ? 1 : 0} Array elements</TextValue>
                        </UePropertyRow>

                        <div className={cn("transition-all duration-700", gateShown ? "opacity-100" : "invisible opacity-0")}>
                            <UePropertyRow label="Index [ 0 ]">
                                <ClassCombo value="Stamina Gate" />
                            </UePropertyRow>
                        </div>

                        <div
                            className={cn(
                                "pointer-events-none absolute inset-x-0 bottom-0 top-8 flex items-center justify-center px-2 text-center text-[10px] italic transition-opacity duration-700",
                                stage === 0 ? "opacity-100" : "opacity-0",
                            )}
                            style={{ color: UE.hover }}
                        >
                            Both lists empty, so the action scores on weight alone.
                        </div>
                    </UeDetailsSection>

                    <div
                        className="border-t px-2 py-2 font-mono text-[10px]"
                        style={{ borderColor: UE.windowBorder, background: UE.background, color: UE.hover2 }}
                    >
                        score = <span style={{ color: UE.foregroundHeader }}>Weight</span>
                        <span className={cn("transition-opacity", distanceShown ? "opacity-100" : "opacity-25")} style={{ color: distanceShown ? UE.accentBlue : undefined }}> × Distance</span>
                        <span className={cn("transition-opacity", gateShown ? "opacity-100" : "opacity-25")} style={{ color: gateShown ? UE.warning : undefined }}> · (Stamina pass)</span>
                        <span className={cn("transition-opacity", customShown ? "opacity-100" : "opacity-25")} style={{ color: customShown ? UE.dataAsset : undefined }}> × Yours</span>
                    </div>
                </div>

                <div className="shrink-0 lg:w-[220px]">
                    <div className="mb-1.5 text-[10px]" style={{ color: UE.hover2 }}>
                        {pickingGate ? "Gates, class picker" : "Scorers, class picker"}
                    </div>

                    <div className="ue-dp-picker overflow-hidden py-1">
                        {pickerOptions.map((option) => (
                            <div
                                key={option}
                                data-selected={option === picked}
                                className="ue-dp-picker-item flex w-full items-center px-2 py-[3px] text-left text-[13px] leading-[18px]"
                                style={{ color: option === picked ? UE.foregroundHover : UE.foregroundHeader }}
                            >
                                <span className="truncate">{option}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex min-h-[54px] flex-col gap-1">
                        {distanceShown && (
                            <div className="flex items-center gap-1 text-[10px]" style={{ color: UE.hover2 }}>
                                <Check className="h-3 w-3" style={{ color: UE.success }} /> Distance Scorer added
                            </div>
                        )}
                        {gateShown && (
                            <div className="flex items-center gap-1 text-[10px]" style={{ color: UE.hover2 }}>
                                <Check className="h-3 w-3" style={{ color: UE.success }} /> Stamina Gate added
                            </div>
                        )}
                        {customShown && (
                            <div className="flex items-center gap-1 text-[10px]" style={{ color: UE.hover2 }}>
                                <Check className="h-3 w-3" style={{ color: UE.success }} /> Blueprint scorer added
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UePanel>
    );
}
