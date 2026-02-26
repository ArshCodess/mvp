import ReactQueryProvider from "@/hooks/providers/DashQuery";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (

        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>

    )
}