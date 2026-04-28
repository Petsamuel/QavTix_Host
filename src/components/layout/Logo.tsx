import Image from "next/image";
import logoSrc from "@/public-assets/logo/logo-1.png"
import Link from "next/link";

export default function Logo({ width = 80, height = 35, logo = logoSrc }: { width?: number; height?: number, logo?: string }) {
    return (
        <Link href="/dashboard" className="inline-block relative z-10">
            <Image src={logo} alt="Qavtix Logo" width={width} height={height} />
        </Link>
    )
}