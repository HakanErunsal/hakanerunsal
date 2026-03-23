"use client"

import { useEffect, useState } from 'react';
import { Play, Zap, ShoppingCart, Smartphone, CheckCircle, ShieldCheck, Layout, RefreshCw, Loader2 } from 'lucide-react';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Manual flow
// ---------------------------------------------------------------------------

type ManualPhase =
    | 'idle'
    | 'init'
    | 'configured'
    | 'fetch'
    | 'offerings'
    | 'purchase'
    | 'dialog'
    | 'completed'
    | 'entitlement';

const manualPhaseLabels: Record<ManualPhase, string> = {
    idle: 'Waiting…',
    init: 'Game starts → SDK configuring…',
    configured: 'OnConfigured fired — SDK ready',
    fetch: 'FetchOfferings() called…',
    offerings: 'OnOfferingsFetched — products loaded',
    purchase: 'PurchasePackage(pkg) called…',
    dialog: 'Native store dialog open…',
    completed: 'OnPurchaseCompleted — Success',
    entitlement: 'IsEntitlementActive("pro") → true',
};

// ---------------------------------------------------------------------------
// Paywall flow
// ---------------------------------------------------------------------------

type PaywallPhase =
    | 'idle'
    | 'present'
    | 'ui'
    | 'action-purchase'
    | 'action-restore'
    | 'action-dismiss'
    | 'result';

const paywallPhaseLabels: Record<PaywallPhase, string> = {
    idle: 'Waiting…',
    present: 'PresentPaywall() called…',
    ui: 'Native paywall UI visible',
    'action-purchase': 'Player taps "Buy"…',
    'action-restore': 'Player taps "Restore"…',
    'action-dismiss': 'Player dismisses paywall',
    result: 'OnPaywallCompleted fired',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nodeStyle(active: boolean, colors: string) {
    return classNames(
        "relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all duration-500",
        active
            ? `${colors} scale-[1.02] shadow-lg`
            : "border-border bg-card text-muted-foreground opacity-50 scale-100"
    );
}

function connectorStyle(active: boolean) {
    return classNames(
        "mx-auto h-5 w-px transition-all duration-500",
        active ? "bg-primary" : "bg-border"
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PurchaseFlowVisualizer() {
    const [tab, setTab] = useState<'manual' | 'paywall'>('manual');
    const [manualPhase, setManualPhase] = useState<ManualPhase>('idle');
    const [paywallPhase, setPaywallPhase] = useState<PaywallPhase>('idle');
    const [cycle, setCycle] = useState(0);

    // Manual flow loop
    useEffect(() => {
        if (tab !== 'manual') return;
        let mounted = true;

        const sequence = async () => {
            while (mounted) {
                setManualPhase('idle');
                await new Promise(r => setTimeout(r, 800));
                if (!mounted) return;

                setManualPhase('init');
                await new Promise(r => setTimeout(r, 900));
                if (!mounted) return;

                setManualPhase('configured');
                await new Promise(r => setTimeout(r, 1000));
                if (!mounted) return;

                setManualPhase('fetch');
                await new Promise(r => setTimeout(r, 900));
                if (!mounted) return;

                setManualPhase('offerings');
                await new Promise(r => setTimeout(r, 1000));
                if (!mounted) return;

                setManualPhase('purchase');
                await new Promise(r => setTimeout(r, 900));
                if (!mounted) return;

                setManualPhase('dialog');
                await new Promise(r => setTimeout(r, 1200));
                if (!mounted) return;

                setManualPhase('completed');
                await new Promise(r => setTimeout(r, 1000));
                if (!mounted) return;

                setManualPhase('entitlement');
                await new Promise(r => setTimeout(r, 1400));
                if (!mounted) return;

                setCycle(c => c + 1);
            }
        };

        sequence();
        return () => { mounted = false; };
    }, [tab, cycle]);

    // Paywall flow loop — cycles through the three player outcomes
    useEffect(() => {
        if (tab !== 'paywall') return;
        let mounted = true;
        let paywallCycle = 0;

        const sequence = async () => {
            while (mounted) {
                setPaywallPhase('idle');
                await new Promise(r => setTimeout(r, 800));
                if (!mounted) return;

                setPaywallPhase('present');
                await new Promise(r => setTimeout(r, 900));
                if (!mounted) return;

                setPaywallPhase('ui');
                await new Promise(r => setTimeout(r, 1200));
                if (!mounted) return;

                const actions: PaywallPhase[] = ['action-purchase', 'action-restore', 'action-dismiss'];
                setPaywallPhase(actions[paywallCycle % 3]);
                await new Promise(r => setTimeout(r, 1100));
                if (!mounted) return;

                setPaywallPhase('result');
                await new Promise(r => setTimeout(r, 1400));
                if (!mounted) return;

                paywallCycle++;
                setCycle(c => c + 1);
            }
        };

        sequence();
        return () => { mounted = false; };
    }, [tab]);

    const isManual = (p: ManualPhase) => manualPhase === p;
    const isPaywall = (p: PaywallPhase) => paywallPhase === p;

    const manualPast = (phases: ManualPhase[]) => {
        const order: ManualPhase[] = ['idle', 'init', 'configured', 'fetch', 'offerings', 'purchase', 'dialog', 'completed', 'entitlement'];
        const cur = order.indexOf(manualPhase);
        return phases.some(p => order.indexOf(p) < cur && cur > 0);
    };

    const paywallPast = (phases: PaywallPhase[]) => {
        const order: PaywallPhase[] = ['idle', 'present', 'ui', 'action-purchase', 'action-restore', 'action-dismiss', 'result'];
        const cur = order.indexOf(paywallPhase);
        return phases.some(p => order.indexOf(p) < cur && cur > 0);
    };

    const isPlayerAction = paywallPhase === 'action-purchase' || paywallPhase === 'action-restore' || paywallPhase === 'action-dismiss';
    const playerActionLabel =
        paywallPhase === 'action-purchase' ? 'Player taps "Buy"' :
            paywallPhase === 'action-restore' ? 'Player taps "Restore"' :
                paywallPhase === 'action-dismiss' ? 'Player dismisses' :
                    'Player action…';

    const statusLabel = tab === 'manual'
        ? manualPhaseLabels[manualPhase]
        : paywallPhaseLabels[paywallPhase];

    const isActive = tab === 'manual'
        ? manualPhase !== 'idle'
        : paywallPhase !== 'idle';

    const isDone = tab === 'manual'
        ? manualPhase === 'entitlement'
        : paywallPhase === 'result';

    return (
        <div className="my-8 rounded-lg border border-border bg-black/20 p-6 shadow-sm">
            {/* Tabs */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => { setTab('manual'); setCycle(0); }}
                    className={classNames(
                        "rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                        tab === 'manual'
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                >
                    Manual Flow
                </button>
                <button
                    onClick={() => { setTab('paywall'); setCycle(0); }}
                    className={classNames(
                        "rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                        tab === 'paywall'
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                >
                    Native Paywall
                </button>
            </div>

            {/* Status bar */}
            <div className="mb-6 flex items-center gap-2 rounded-md bg-background/60 px-4 py-2 border border-border">
                <div className={classNames(
                    "h-2 w-2 shrink-0 rounded-full transition-colors duration-300",
                    !isActive ? "bg-muted-foreground" :
                        isDone ? "bg-green-500" :
                            "bg-yellow-500 animate-pulse"
                )} />
                <span className="text-sm font-mono text-muted-foreground truncate">{statusLabel}</span>
            </div>

            {/* ---- Manual Flow ---- */}
            {tab === 'manual' && (
                <div className="mx-auto max-w-md space-y-0">
                    {/* 1. Game Starts */}
                    <div className={nodeStyle(isManual('init') || isManual('configured'), "border-blue-500 bg-blue-500/10 text-blue-500")}>
                        <Play className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold">Game Starts</div>
                            <div className="text-xs opacity-75">SDK auto-configures from Project Settings</div>
                        </div>
                    </div>

                    <div className={connectorStyle(isManual('configured') || manualPast(['init']))} />

                    {/* 2. OnConfigured */}
                    <div className={nodeStyle(isManual('configured'), "border-green-500 bg-green-500/10 text-green-500")}>
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">OnConfigured</div>
                            <div className="text-xs opacity-75">SDK ready</div>
                        </div>
                    </div>

                    <div className={connectorStyle(isManual('fetch') || isManual('offerings') || manualPast(['configured']))} />

                    {/* 3. FetchOfferings */}
                    <div className={nodeStyle(isManual('fetch') || isManual('offerings'), "border-cyan-500 bg-cyan-500/10 text-cyan-500")}>
                        <RefreshCw className={classNames("h-5 w-5 shrink-0", isManual('fetch') && "animate-spin")} />
                        <div>
                            <div className="text-sm font-semibold font-mono">FetchOfferings()</div>
                            <div className="text-xs opacity-75">
                                {isManual('offerings') ? 'OnOfferingsFetched — products loaded' : 'Fetching from RevenueCat…'}
                            </div>
                        </div>
                    </div>

                    <div className={connectorStyle(isManual('purchase') || isManual('dialog') || manualPast(['offerings']))} />

                    {/* 4. PurchasePackage */}
                    <div className={nodeStyle(isManual('purchase') || isManual('dialog'), "border-orange-500 bg-orange-500/10 text-orange-500")}>
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">PurchasePackage(pkg)</div>
                            <div className="text-xs opacity-75">
                                {isManual('dialog') ? 'Native store dialog open…' : 'Initiating purchase flow'}
                            </div>
                        </div>
                        {isManual('dialog') && <Smartphone className="h-4 w-4 shrink-0 ml-auto opacity-60" />}
                    </div>

                    <div className={connectorStyle(isManual('completed') || isManual('entitlement') || manualPast(['dialog']))} />

                    {/* 5. OnPurchaseCompleted */}
                    <div className={nodeStyle(isManual('completed'), "border-purple-500 bg-purple-500/10 text-purple-500")}>
                        <Zap className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">OnPurchaseCompleted</div>
                            <div className="text-xs opacity-75">Result + CustomerInfo</div>
                        </div>
                    </div>

                    <div className={connectorStyle(isManual('entitlement') || manualPast(['completed']))} />

                    {/* 6. IsEntitlementActive */}
                    <div className={nodeStyle(isManual('entitlement'), "border-green-500 bg-green-500/10 text-green-500")}>
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">IsEntitlementActive("pro")</div>
                            <div className="text-xs opacity-75">→ true — unlock premium content</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Paywall Flow ---- */}
            {tab === 'paywall' && (
                <div className="mx-auto max-w-md space-y-0">
                    {/* 1. PresentPaywall */}
                    <div className={nodeStyle(isPaywall('present'), "border-blue-500 bg-blue-500/10 text-blue-500")}>
                        <Layout className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">PresentPaywall()</div>
                            <div className="text-xs opacity-75">or PresentPaywallIfNeeded("pro")</div>
                        </div>
                    </div>

                    <div className={connectorStyle(isPaywall('ui') || paywallPast(['present']))} />

                    {/* 2. Native paywall UI */}
                    <div className={nodeStyle(isPaywall('ui') || isPlayerAction, "border-cyan-500 bg-cyan-500/10 text-cyan-500")}>
                        <Smartphone className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold">Native Paywall UI</div>
                            <div className="text-xs opacity-75">Dashboard-configured, no app update needed</div>
                        </div>
                    </div>

                    <div className={connectorStyle(isPlayerAction || paywallPast(['ui']))} />

                    {/* 3. Player action */}
                    <div className={nodeStyle(
                        isPlayerAction,
                        paywallPhase === 'action-purchase' ? "border-orange-500 bg-orange-500/10 text-orange-500" :
                            paywallPhase === 'action-restore' ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" :
                                "border-slate-500 bg-slate-500/10 text-slate-400"
                    )}>
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold">{playerActionLabel}</div>
                            <div className="text-xs opacity-75">
                                {paywallPhase === 'action-purchase' ? 'Completing purchase…' :
                                    paywallPhase === 'action-restore' ? 'Restoring previous purchases…' :
                                        paywallPhase === 'action-dismiss' ? 'Paywall closed' : 'Waiting…'}
                            </div>
                        </div>
                        {paywallPhase === 'action-purchase' && <Loader2 className="h-4 w-4 shrink-0 ml-auto animate-spin opacity-60" />}
                    </div>

                    <div className={connectorStyle(isPaywall('result') || paywallPast(['action-purchase', 'action-restore', 'action-dismiss']))} />

                    {/* 4. OnPaywallCompleted */}
                    <div className={nodeStyle(isPaywall('result'), "border-green-500 bg-green-500/10 text-green-500")}>
                        <Zap className="h-5 w-5 shrink-0" />
                        <div>
                            <div className="text-sm font-semibold font-mono">OnPaywallCompleted</div>
                            <div className="text-xs opacity-75">Result (Purchased / Restored / Cancelled) + CustomerInfo</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
