import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Command Center | Job Search",
    description: "Private job search dashboard",
    robots: {
        index: false,
        follow: false,
    },
}

export default function JobHuntLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            {children}
        </div>
    )
}
