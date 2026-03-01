export default function ArticlesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative">
            {/* Radial gradient light effect from top */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] z-0"
                style={{
                    background: "radial-gradient(ellipse at top center, hsla(164, 35%, 50%, 0.12) 0%, hsla(228, 15%, 7%, 0) 70%)",
                }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
