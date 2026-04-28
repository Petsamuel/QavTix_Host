import "./globals.css"
import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import { inter } from "@/lib/fonts"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import { ReactNode } from "react"
import PopUpsRenderer from "@/components/modals/"
import { getServerAxios } from "@/lib/axios"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import AuthPersistor from "@/persistors/AuthPersistor"
import { hostSiteMetadata } from "@/lib/metadata"

export const metadata = hostSiteMetadata

type LayoutProps = {
    children: ReactNode
}

async function getLayoutData() {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_PROFILE_ENDPOINT)
        console.log("data", data)
        const hostData = data.host
            ? { ...data.host, subscription: data.subscription, verified_badge: data.verified_badge, payout_available: data.payout_available } as AuthUser
            : null
        return hostData
    } catch {
        return null
    }
}

export default async function Layout({ children }: LayoutProps) {
    const profileData = await getLayoutData()
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body className={`${inter.className} min-h-screen`}>
                <ReduxStoreProvider>
                    <div className="flex justify-end min-h-screen bg-gray-100/70">
                        <DesktopSideNav />
                        <div className="w-full lg:w-[calc(100%-240px)]">
                            <div className="w-full">
                                <MobileHeaderSection />
                                <div id="step-top" className="relative w-full lg:pt-28 px-4 md:px-6">
                                    <DesktopHeaderSection />
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                    <AuthPersistor userData={profileData || null} />
                    <PopUpsRenderer />
                </ReduxStoreProvider>
            </body>
        </html>
    )
}