import Image, { StaticImageData } from "next/image";
import logoSrc from "@/public-assets/logo/logo-1.png"
import Link from "next/link";

export default function Logo({ width = 80, height = 30, logo = logoSrc }: { width?: number; height?: number, logo?: StaticImageData }) {
    return (
        <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN || "/dashboard"} className="inline-block relative z-10">
            <Image src={logo} alt="Qavtix Logo" width={width} height={height} loading="eager" />
        </Link>
    )
}