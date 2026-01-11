"use client"

import { JobTracker } from "@/components/job-tracker"
import { SEARCH_PRESETS, SearchRegion } from "@/lib/job-hunt-types"
import Link from "next/link"
import { ArrowLeft, Search, Briefcase, Globe, Database, DollarSign } from "lucide-react"

export default function JobHuntDashboard() {

    const generateUrl = (platform: string, query: string, region: SearchRegion) => {
        const q = encodeURIComponent(query)

        // GeoIDs and Location Strings
        // LinkedIn: 101282230 (DE), 91000000 (Europe), 103644278 (USA)
        // Indeed: defaults to domain. for US use www.indeed.com

        let linkedInGeo = "&geoId=101282230" // Default DE
        let hiringCafeLoc = "Germany"
        let indeedDomain = "de.indeed.com"
        let indeedLoc = "Remote"

        if (region === 'EU') {
            linkedInGeo = "&geoId=91000000" // Europe
            hiringCafeLoc = "Europe"
            indeedDomain = "ie.indeed.com" // Ireland/EU hub often used for english speakers
        } else if (region === 'US') {
            linkedInGeo = "&geoId=103644278" // United States
            hiringCafeLoc = "United States"
            indeedDomain = "www.indeed.com"
        }

        const isRemote = true // Always default to remote for this broad search
        const linkedInLoc = isRemote ? "&f_WT=2" : ""

        switch (platform) {
            case 'LinkedIn':
                return `https://www.linkedin.com/jobs/search/?keywords=${q}${linkedInLoc}${linkedInGeo}&sort=date`
            case 'Indeed':
                return `https://${indeedDomain}/jobs?q=${q}&l=${indeedLoc}&fromage=14`
            case 'HiringCafe':
                const hcState = {
                    searchQuery: query.replace(/[()]/g, ''),
                    locations: [
                        {
                            formatted_address: hiringCafeLoc, // "Germany", "Europe", "United States"
                            workplace_types: ["Remote"] // Force Remote for international
                        }
                    ]
                }
                return `https://hiring.cafe/?searchState=${encodeURIComponent(JSON.stringify(hcState))}`

            default:
                return '#'
        }
    }

    return (
        <div className="container relative max-w-5xl py-10">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">Command Center</h1>
                    <p className="text-muted-foreground">Automated Job Search & Application Tracking</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_3fr]">

                {/* Left Column: Search Tools */}
                <div className="space-y-6">
                    <section className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="flex items-center text-xl font-semibold mb-4">
                            <Search className="mr-2 h-5 w-5 text-primary" />
                            Search Operations
                        </h2>
                        <div className="space-y-6">
                            {SEARCH_PRESETS.map((preset, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium flex items-center gap-2">
                                            {preset.region === 'DE' && <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded">DE</span>}
                                            {preset.region === 'EU' && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">EU</span>}
                                            {preset.region === 'US' && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">US</span>}

                                            {preset.name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {preset.platforms.map(platform => {
                                            const url = generateUrl(platform, preset.query, preset.region)
                                            if (url === '#') return null
                                            return (
                                                <a
                                                    key={platform}
                                                    href={url}
                                                    target="_blank"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 px-3"
                                                >
                                                    {platform}
                                                </a>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded truncate">
                                        {preset.query}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Strategy Notes</h2>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li><strong>Region Tags</strong>: <span className="text-xs bg-blue-100 dark:bg-blue-900 px-1 rounded">EU</span> covers all Europe. <span className="text-xs bg-green-100 dark:bg-green-900 px-1 rounded">US</span> targets Freelance/Contract in States.</li>
                            <li><strong>Broad Search</strong>: "Remote" filters are strictly enforced.</li>
                            <li><strong>HiringCafe</strong>: Uses specific region targets (Europe/US/Germany).</li>
                        </ul>
                    </section>
                </div>

                {/* Right Column: Tracker */}
                <div>
                    <JobTracker />
                </div>

            </div>
        </div>
    )
}
