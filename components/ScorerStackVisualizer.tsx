"use client"

import { useEffect, useState } from 'react';
import { Ruler, ShieldCheck, Sparkles, Plus, Pencil, Check, Layers } from 'lucide-react';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// Stages of the loop:
// 0  empty list (opt-in: the action rides on its weight)
// 1  a built-in Distance Scorer drops in
// 2  a built-in Stamina Gate drops in
// 3  a custom card is authored on the right and gets named
// 4  the custom card joins the bottom of the list
// 5  hold the full stack, then loop
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

    // A list card. `shown` drives the slide-in; `accent` themes scorer vs gate vs custom.
    const Card = ({
        shown, icon, name, kind, effect, accent, dashed,
    }: {
        shown: boolean;
        icon: React.ReactNode;
        name: string;
        kind: string;
        effect: string;
        accent: string;
        dashed?: boolean;
    }) => (
        <div
            className={classNames(
                "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-all duration-700 ease-out",
                dashed ? "border-dashed" : "border-solid",
                accent,
                shown ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0",
            )}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background/60">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{name}</div>
                <div className="text-[11px] text-muted-foreground">{kind}</div>
            </div>
            <div className="shrink-0 rounded bg-background/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                {effect}
            </div>
        </div>
    );

    // Right-side library chip. Lights up while its card is being added.
    const Chip = ({ active, done, icon, label }: { active: boolean; done: boolean; icon: React.ReactNode; label: string }) => (
        <div
            className={classNames(
                "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition-all duration-300",
                active ? "border-primary bg-primary/10 text-foreground scale-[1.03]"
                    : done ? "border-border bg-card text-muted-foreground opacity-50"
                        : "border-border bg-card text-muted-foreground",
            )}
        >
            <span className="shrink-0">{icon}</span>
            <span className="truncate">{label}</span>
            {done && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-500" />}
        </div>
    );

    const distanceShown = stage >= 1;
    const gateShown = stage >= 2;
    const customInList = stage >= 4;
    const customOnRight = stage === 3 || stage === 4; // authored, before it joins the list

    return (
        <div className="my-8 rounded-xl border border-border bg-black/20 p-5 shadow-sm sm:p-6">
            <div className="mb-5 text-center">
                <div className="text-sm font-semibold text-foreground">Scoring one action</div>
                <div className="text-xs text-muted-foreground">
                    Scorers and gates are opt-in and stack. Add only the dimensions an action should care about.
                </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6">

                {/* LEFT: the action's Scoring list */}
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <Layers className="h-3.5 w-3.5" />
                        Scoring list
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Base row, always present */}
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background/60 text-muted-foreground">
                                <span className="font-mono text-xs">W</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-foreground">SelectionWeight</div>
                                <div className="text-[11px] text-muted-foreground">Always present, the base score</div>
                            </div>
                            <div className="shrink-0 rounded bg-background/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">× base</div>
                        </div>

                        <Card
                            shown={distanceShown}
                            icon={<Ruler className="h-5 w-5 text-sky-400" />}
                            name="Distance Scorer"
                            kind="Built-in scorer · multiplier"
                            effect="× range"
                            accent="border-sky-500/40"
                        />
                        <Card
                            shown={gateShown}
                            icon={<ShieldCheck className="h-5 w-5 text-amber-400" />}
                            name="Stamina Gate"
                            kind="Built-in gate · pass or veto"
                            effect="pass / fail"
                            accent="border-amber-500/40"
                        />
                        <Card
                            shown={customInList}
                            icon={<Sparkles className="h-5 w-5 text-violet-400" />}
                            name="Ally-Count Scorer"
                            kind="Your subclass · Blueprint or C++"
                            effect="× your rule"
                            accent="border-violet-500/50"
                            dashed
                        />

                        {/* Empty-state hint */}
                        <div
                            className={classNames(
                                "rounded-lg border border-dashed border-border px-3 py-2.5 text-center text-[11px] text-muted-foreground transition-all duration-500",
                                stage === 0 ? "opacity-100" : "pointer-events-none h-0 -translate-y-1 overflow-hidden py-0 opacity-0",
                            )}
                        >
                            No scorers or gates. The action scores on its weight alone, the same in every situation, and is never vetoed.
                        </div>
                    </div>
                </div>

                {/* RIGHT: the library you pull from */}
                <div className="md:w-56">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Add from the library
                    </div>

                    <div className="flex flex-col gap-2">
                        <Chip active={stage === 1} done={stage > 1} icon={<Ruler className="h-4 w-4 text-sky-400" />} label="Distance Scorer" />
                        <Chip active={stage === 2} done={stage > 2} icon={<ShieldCheck className="h-4 w-4 text-amber-400" />} label="Stamina Gate" />
                        <div className="my-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground/70">or write your own</div>

                        {/* Create-custom affordance: a card authored here, then it joins the list */}
                        <div
                            className={classNames(
                                "rounded-md border border-dashed px-2.5 py-2 transition-all duration-500",
                                customOnRight ? "border-violet-500/60 bg-violet-500/10" : "border-border bg-card",
                                stage === 4 ? "scale-95 opacity-40" : "opacity-100",
                            )}
                        >
                            <div className="flex items-center gap-2 text-xs">
                                {customOnRight
                                    ? <Pencil className="h-4 w-4 shrink-0 text-violet-400" />
                                    : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                                <span className={classNames("truncate", customOnRight ? "text-foreground" : "text-muted-foreground")}>
                                    {customOnRight
                                        ? (customNamed ? "Ally-Count Scorer" : "New Scorer")
                                        : "Create custom"}
                                </span>
                                {customOnRight && !customNamed && (
                                    <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-violet-400" />
                                )}
                            </div>
                            <div className={classNames(
                                "mt-1 text-[10px] text-muted-foreground transition-opacity duration-300",
                                customOnRight ? "opacity-100" : "opacity-0",
                            )}>
                                subclass USECScorer, override one function
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live formula: grows as scorers stack in */}
            <div className="mt-5 rounded-lg border border-border bg-background/40 px-4 py-3 text-center">
                <span className="font-mono text-xs text-muted-foreground sm:text-sm">
                    score = <span className="text-foreground">Weight</span>
                    <span className={classNames("transition-opacity duration-500", distanceShown ? "opacity-100 text-sky-400" : "opacity-30")}> × Distance</span>
                    <span className={classNames("transition-opacity duration-500", gateShown ? "opacity-100 text-amber-400" : "opacity-30")}> · (Stamina pass)</span>
                    <span className={classNames("transition-opacity duration-500", customInList ? "opacity-100 text-violet-400" : "opacity-30")}> × Yours</span>
                </span>
            </div>

            <div className="mt-3 text-center text-xs text-muted-foreground">
                Each scorer multiplies in; each gate can veto. Mix built-ins with <span className="text-violet-400">your own</span>.
            </div>
        </div>
    );
}
