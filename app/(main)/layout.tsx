import { SiteFooter } from "@/components/site-footer";
import { SiteTreeSidebar } from "@/components/site-tree-sidebar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Persistent sidebar across all sections */}
            <SiteTreeSidebar />
            <div className="flex flex-col flex-grow lg:ml-72">
                <main className="flex-grow overflow-x-clip">{children}</main>
            </div>
            <SiteFooter />
        </div>
    );
}
