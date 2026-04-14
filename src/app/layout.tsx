import "./globals.css"
import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import { inter } from "@/lib/fonts"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import { Metadata } from "next"
import { ReactNode } from "react"
import PopUpsRenderer from "@/components/modals/"
import { getServerAxios } from "@/lib/axios"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import AuthPersistor from "@/persistors/AuthPersistor"


type LayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Qavtix Host - Under-development'
}


async function getLayoutData() {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_PROFILE_ENDPOINT)
        const hostData = data.host ? {...data.host, subscription: data.subscription, verified_badge: data.verified_badge, payout_available: data.payout_available } as AuthUser : null
        return hostData;
    } catch (err) {
        return null
    }
}


export default async function Layout({ children }: LayoutProps) {

    const profileData = await getLayoutData()

    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen`}>
                <ReduxStoreProvider>
                    <div className="flex justify-end min-h-screen bg-gray-100/70">
                        {/* Fixed Sidebar - Takes no space in flex layout */}
                        <DesktopSideNav />
                        
                        {/* Main Content Area */}
                        <div className="w-full lg:w-[calc(100%-240px)]">
                        {/* Scrollable Content */}
                        <div className="w-full">
                            <MobileHeaderSection />
                            <div className="relative w-full lg:pt-28 px-4 md:px-6">
                            {/* Desktop Header - Fixed at top */}
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