"use client"

import { GitBranch, Filter, CornerDownRight, Repeat, LogIn, MousePointerClick } from 'lucide-react';

// Static, data-driven render of the SEC core StateTree. Not animated. To update it after a
// tree change, edit the CORE object below; the layout follows the data.

type TaskWhen = 'tick' | 'enter' | 'select';
type Task = { name: string; when: TaskWhen };
type State = {
    name: string;
    accent: string;        // tailwind text color for the state icon and name
    condition?: string;    // enter condition shown under the header
    tasks?: Task[];
    linked?: string;       // name of a linked subtree entered from this state
    dashed?: boolean;      // render as a linked-subtree box
    children?: State[];
};

const CORE: State = {
    name: 'ST_SEC_Core', accent: 'text-indigo-400',
    tasks: [
        { name: 'Build Decision Context', when: 'tick' },
        { name: 'Poll Combat Role', when: 'tick' },
        { name: 'Poll Focus Actor', when: 'tick' },
    ],
    children: [
        {
            name: 'Combat', accent: 'text-sky-400',
            condition: 'Target is valid AND role is not SEC.Role.None',
            tasks: [
                { name: 'Sync Action Set', when: 'enter' },
                { name: 'Sync Reaction Set', when: 'enter' },
                { name: 'Sync Movement Profile', when: 'enter' },
            ],
            children: [
                {
                    name: 'Role', accent: 'text-emerald-400',
                    condition: 'SEC.Role.* matches the current role',
                    linked: 'ST_SEC_MoveAndAction',
                    children: [
                        {
                            name: 'ST_SEC_MoveAndAction', accent: 'text-emerald-400', dashed: true,
                            tasks: [
                                { name: 'AI Movement', when: 'tick' },
                                { name: 'Poll Action', when: 'tick' },
                                { name: 'Do Action', when: 'select' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'Idle', accent: 'text-amber-400',
            condition: 'No valid target',
            tasks: [{ name: 'Delay 1.0', when: 'tick' }],
        },
    ],
};

const WHEN: Record<TaskWhen, { label: string; cls: string; Icon: typeof Repeat }> = {
    tick: { label: 'tick', cls: 'text-sky-400 border-sky-500/40 bg-sky-500/10', Icon: Repeat },
    enter: { label: 'on enter', cls: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', Icon: LogIn },
    select: { label: 'on select', cls: 'text-violet-400 border-violet-500/40 bg-violet-500/10', Icon: MousePointerClick },
};

function TaskPill({ task }: { task: Task }) {
    const w = WHEN[task.when];
    const { Icon } = w;
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-2 py-1 text-xs text-foreground/90">
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium border ${w.cls}`}>
                <Icon className="h-3 w-3" />{w.label}
            </span>
            {task.name}
        </span>
    );
}

function StateNode({ state }: { state: State }) {
    return (
        <div
            className={[
                "rounded-lg border bg-card/50 p-3",
                state.dashed ? "border-dashed border-emerald-500/40" : "border-border",
            ].join(' ')}
        >
            <div className="flex items-center gap-2">
                {state.dashed
                    ? <CornerDownRight className={`h-4 w-4 shrink-0 ${state.accent}`} />
                    : <GitBranch className={`h-4 w-4 shrink-0 ${state.accent}`} />}
                <span className={`font-mono text-sm font-semibold ${state.accent}`}>{state.name}</span>
                {state.dashed && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
                        linked subtree
                    </span>
                )}
            </div>

            {state.condition && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs italic text-muted-foreground">
                    <Filter className="h-3 w-3 shrink-0" />
                    {state.condition}
                </div>
            )}

            {state.tasks && state.tasks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {state.tasks.map((t) => <TaskPill key={t.name} task={t} />)}
                </div>
            )}

            {state.linked && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                    <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
                    Linked subtree: <span className="font-mono">{state.linked}</span>
                </div>
            )}

            {state.children && state.children.length > 0 && (
                <div className="mt-3 space-y-2 border-l border-border/60 pl-3 sm:pl-4">
                    {state.children.map((c) => <StateNode key={c.name} state={c} />)}
                </div>
            )}
        </div>
    );
}

export default function StateTreeDiagram({ caption }: { caption?: string }) {
    return (
        <div className="my-8 rounded-xl border border-border bg-black/20 p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wide">SEC core StateTree</span>
                <span className="inline-flex items-center gap-1"><Repeat className="h-3 w-3 text-sky-400" /> ticks each frame</span>
                <span className="inline-flex items-center gap-1"><LogIn className="h-3 w-3 text-emerald-400" /> runs on enter</span>
                <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-violet-400" /> runs on select</span>
            </div>

            <StateNode state={CORE} />

            <div className="mt-4 text-center text-xs text-muted-foreground">
                {caption ?? 'One option for the brain. Leave AIConfig\'s DefaultStateTree empty and the same loop runs in native C++ instead.'}
            </div>
        </div>
    );
}
