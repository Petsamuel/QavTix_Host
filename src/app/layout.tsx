import "./globals.css"
import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import { inter } from "@/lib/fonts"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import { ReactNode } from "react"
import PopUpsRenderer from "@/components/modals/"
import { cookies } from "next/headers"
import { getServerAxios } from "@/lib/axios"
import { Suspense } from "react"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import AuthPersistor from "@/persistors/AuthPersistor"
import { hostSiteMetadata } from "@/lib/metadata"

export const metadata = hostSiteMetadata

type LayoutProps = {
    children: ReactNode
}


async function getLayoutData() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('host_access_token')?.value
        if (!token) return null
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_PROFILE_ENDPOINT)
        const hostData = data.host
            ? { ...data.host, subscription: data.subscription, verified_badge: data.verified_badge, payout_available: data.payout_available } as AuthUser
            : null
        return hostData
    } catch {
        return null
    }
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>

            <body className={`${inter.className} min-h-screen`}>
                <Suspense fallback={null}>
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
                        <Suspense fallback={null}>
                            <AuthPersistorLoader />
                        </Suspense>
                        <PopUpsRenderer />
                    </ReduxStoreProvider>
                </Suspense>
            </body>
        </html>
    )
}

async function AuthPersistorLoader() {
    const profileData = await getLayoutData()
    return <AuthPersistor userData={profileData} />
}