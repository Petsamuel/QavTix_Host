"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function EmptyTicketsState({ title, text, btnText, href, icon }:{ title: string, text: string, btnText?: string, href?: string, icon?: string }) {

    return (
        <div className="w-full md:max-w-3xl mx-auto py-20 flex flex-col items-center justify-center border-2 border-dashed border-brand-neutral-5 rounded-2xl bg-white">
            <Icon 
                icon={icon || "lucide:tickets"} 
                width="30" 
                height="30" 
                className="text-brand-secondary-8 size-9.5" 
            />
            
            <h3 className="text-brand-secondary-9 text-base font-medium mt-4 mb-2">
                {title}
            </h3>
            
            <p className="text-brand-neutral-7 text-sm mb-6 text-center">
                {text}
            </p>

            {
                href &&
                <Link 
                    href={href}
                    target="_blank"
                    className="bg-brand-primary-6 h-12 flex justify-center items-center hover:bg-brand-primary-7 hover:shadow text-sm text-white px-8 py-6 rounded-[7px] font-bold"
                >
                    {btnText || "Discover Events"}
                </Link>
            }
        </div>
    )
}