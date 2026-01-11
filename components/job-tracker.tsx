"use client"

import { useState, useEffect } from "react"
import { JobApplication, JobStatus } from "@/lib/job-hunt-types"
import { Plus, Trash2, ExternalLink, Save } from "lucide-react"

export function JobTracker() {
    const [jobs, setJobs] = useState<JobApplication[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // New Job Form State
    const [newCompany, setNewCompany] = useState("")
    const [newRole, setNewRole] = useState("")
    const [newLink, setNewLink] = useState("")

    useEffect(() => {
        const saved = localStorage.getItem("my-job-hunt-v1")
        if (saved) {
            setJobs(JSON.parse(saved))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("my-job-hunt-v1", JSON.stringify(jobs))
        }
    }, [jobs, isLoaded])

    const addJob = () => {
        if (!newCompany || !newRole) return
        const newJob: JobApplication = {
            id: crypto.randomUUID(),
            company: newCompany,
            role: newRole,
            link: newLink,
            status: 'Saved',
            dateAdded: new Date().toISOString()
        }
        setJobs([newJob, ...jobs])
        setNewCompany("")
        setNewRole("")
        setNewLink("")
    }

    const updateStatus = (id: string, status: JobStatus) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status } : j))
    }

    const deleteJob = (id: string) => {
        setJobs(jobs.filter(j => j.id !== id))
    }

    if (!isLoaded) return <div className="p-8 text-center">Loading Job Tracker...</div>

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Add New Application</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        placeholder="Company"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                    />
                    <input
                        placeholder="Role (e.g. Senior Gameplay Eng)"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                    />
                    <input
                        placeholder="Link (Optional)"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                    />
                    <button
                        onClick={addJob}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Track
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-0">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Company</th>
                                <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-10 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {jobs.map((job) => (
                                <tr key={job.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{job.company}</td>
                                    <td className="p-4 align-middle">
                                        {job.link ? (
                                            <a href={job.link} target="_blank" className="flex items-center hover:underline hover:text-primary">
                                                {job.role} <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        ) : job.role}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <select
                                            value={job.status}
                                            onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}
                                            className="h-8 w-[130px] rounded-md border border-input bg-transparent px-2 text-xs"
                                        >
                                            <option value="Saved">Saved</option>
                                            <option value="Applied">Applied</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Offer">Offer</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {new Date(job.dateAdded).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <button
                                            onClick={() => deleteJob(job.id)}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No applications tracked yet. Use the search buttons above to find some!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
