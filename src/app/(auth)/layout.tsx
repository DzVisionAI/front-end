import PageIllustration from "@/app/ui/page-illustration"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="grow">

            <PageIllustration />

            {children}

        </main>
    )
}