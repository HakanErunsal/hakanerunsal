"use client"

import { Filter, Repeat, LogIn, MousePointerClick } from 'lucide-react';
import { UePanel, UeDetailsSection, UePropertyRow, UeAssetPicker } from '@/components/ue-editor';

type TaskWhen = 'tick' | 'enter' | 'select';
type Task = { name: string; when: TaskWhen };
type State = {
    name: string;
    headerColor: string;
    condition?: string;
    tasks?: Task[];
    linked?: string;
    dashed?: boolean;
    children?: State[];
};

const CORE: State = {
    name: 'ST_SEC_Core', headerColor: '#4A2C7A',
    tasks: [
        { name: 'Build Decision Context', when: 'tick' },
        { name: 'Poll Combat Role', when: 'tick' },
        { name: 'Poll Focus Actor', when: 'tick' },
    ],
    children: [
        {
            name: 'Combat', headerColor: '#00549E',
            condition: 'Target is valid AND role is not SEC.Role.None',
            tasks: [
                { name: 'Sync Action Set', when: 'enter' },
                { name: 'Sync Reaction Set', when: 'enter' },
                { name: 'Sync Movement Profile', when: 'enter' },
            ],
            children: [
                {
                    name: 'Role', headerColor: '#006633',
                    condition: 'SEC.Role.* matches the current role',
                    linked: 'ST_SEC_MoveAndAction',
                    children: [
                        {
                            name: 'ST_SEC_MoveAndAction', headerColor: '#006633', dashed: true,
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
            name: 'Idle', headerColor: '#8B6914',
            condition: 'No valid target',
            tasks: [{ name: 'Delay 1.0', when: 'tick' }],
        },
    ],
};

const WHEN: Record<TaskWhen, { label: string; color: string; Icon: typeof Repeat }> = {
    tick: { label: 'tick', color: '#34a8ff', Icon: Repeat },
    enter: { label: 'on enter', color: '#6CC644', Icon: LogIn },
    select: { label: 'on select', color: '#A070FF', Icon: MousePointerClick },
};

function TaskRow({ task }: { task: Task }) {
    const w = WHEN[task.when];
    const { Icon } = w;
    return (
        <UePropertyRow label={w.label}>
            <div className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 shrink-0" style={{ color: w.color }} />
                <span className="font-mono text-[11px] text-[#cccccc]">{task.name}</span>
            </div>
        </UePropertyRow>
    );
}

function StateSection({ state, depth = 0 }: { state: State; depth?: number }) {
    return (
        <UeDetailsSection title={state.name} defaultOpen={depth < 2}>
            {state.condition && (
                <UePropertyRow label="Enter Condition">
                    <div className="flex items-center gap-1.5 text-[11px] italic text-[#888888]">
                        <Filter className="h-3 w-3 shrink-0" />
                        {state.condition}
                    </div>
                </UePropertyRow>
            )}

            {state.dashed && (
                <UePropertyRow label="Type">
                    <span className="text-[11px] text-[#6CC644]">Linked subtree</span>
                </UePropertyRow>
            )}

            {state.linked && (
                <UePropertyRow label="Linked Subtree">
                    <UeAssetPicker value={state.linked} />
                </UePropertyRow>
            )}

            {state.tasks?.map((t) => <TaskRow key={t.name} task={t} />)}

            {state.children?.map((c) => (
                <div key={c.name} className="border-t border-[#111111] pl-2">
                    <StateSection state={c} depth={depth + 1} />
                </div>
            ))}
        </UeDetailsSection>
    );
}

export default function StateTreeDiagram({ caption }: { caption?: string }) {
    return (
        <UePanel
            title="StateTree"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat", "ST_SEC_Core"]}
            assetType="statetree"
            caption={caption ?? "One option for the brain. Leave AIConfig's DefaultStateTree empty and the same loop runs in native C++ instead."}
            bodyClassName="p-0"
        >
            <div className="flex items-center gap-3 border-b border-[#111111] bg-[#151515] px-2 py-1 text-[10px] text-[#666666]">
                <span className="flex items-center gap-1"><Repeat className="h-3 w-3 text-[#34a8ff]" /> tick</span>
                <span className="flex items-center gap-1"><LogIn className="h-3 w-3 text-[#6CC644]" /> on enter</span>
                <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-[#A070FF]" /> on select</span>
            </div>

            <div className="overflow-hidden rounded-[2px] border-x-0 border-b-0 border border-[#111111]">
                <StateSection state={CORE} />
            </div>
        </UePanel>
    );
}
