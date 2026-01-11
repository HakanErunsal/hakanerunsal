import { SiteFooter } from "@/components/site-footer";
import NavigationColumn from "@/components/site-navigation-column";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex flex-col flex-grow">
                <NavigationColumn />
                <main className="flex-grow">{children}</main>
            </div>
            <SiteFooter />
        </div>
    );
}
