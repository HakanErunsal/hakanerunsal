export type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export type SearchRegion = 'DE' | 'EU' | 'US' | 'GLOBAL';

export interface JobApplication {
    id: string;
    company: string;
    role: string;
    link: string;
    status: JobStatus;
    dateAdded: string; // ISO String
    notes?: string;
}

export interface SearchPreset {
    name: string;
    query: string;
    region: SearchRegion;
    platforms: string[];
}

export const SEARCH_PRESETS: SearchPreset[] = [
    {
        name: "Unreal Core (Germany Remote)",
        query: '("Unreal Engine" OR "UE5") AND ("C++") AND ("Remote" OR "Home Office")',
        region: 'DE',
        platforms: ['LinkedIn', 'HiringCafe', 'Indeed']
    },
    {
        name: "Unreal Europe (Remote)",
        query: '("Unreal Engine" OR "UE5") AND ("C++") AND ("Remote")',
        region: 'EU',
        platforms: ['LinkedIn', 'HiringCafe']
    },
    {
        name: "Unreal US (Freelance/Contract)",
        query: '("Unreal Engine") AND ("Contract" OR "Freelance") AND ("Remote")',
        region: 'US',
        platforms: ['LinkedIn', 'HiringCafe', 'Indeed']
    },
    {
        name: "Sim & Industrial (Germany)",
        query: '("Unreal Engine") AND ("Simulation" OR "Automotive" OR "Digital Twin" OR "Training") AND "C++"',
        region: 'DE',
        platforms: ['LinkedIn', 'Indeed']
    },
    {
        name: "General C++ (Gaming Europe)",
        query: '("Game Programmer" OR "Gameplay Engineer") AND "C++" -Unity',
        region: 'EU',
        platforms: ['LinkedIn', 'HiringCafe']
    }
];
