"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = ({
    expandedSider,
    setExpandedSider,
}: {
    expandedSider: boolean;
    setExpandedSider: any;
}) => {
    return (
        <div className="fixed top-0 z-10 w-full h-[100px] md:h-[60px]">
            <div className="flex justify-between h-[60px] bg-sig-purple px-4 py-2.5 border-b-2 border-sig-golden">
                <div className="flex items-center gap-4 h-[40px] hover:cursor-pointer">
                    <div className="hidden md:block h-6">
                        <span
                            className={
                                expandedSider
                                    ? "material-symbols-outlined text-sig-gray3 hover:text-white hover:cursor-pointer"
                                    : "material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer"
                            }
                            onClick={(e) => setExpandedSider(!expandedSider)}
                        >
                            menu
                        </span>
                    </div>
                    <Link href={"/"}>
                        <Image
                            src="/logo-sigecro.webp"
                            alt="logo_sig"
                            className="h-[35px] w-[auto]"
                            width={100}
                            height={100}
                            priority
                        />
                    </Link>
                </div>
                <div className="flex gap-4 justify-end items-center h-[40px]">
                    <Link href={"/noticias"}>
                        <div className="text-lg font-semibold text-white hover:cursor-pointer hover:text-sig-gray3 hidden md:block">
                            Noticias
                        </div>
                    </Link>
                    <div className="text-lg font-semibold text-white hover:cursor-pointer hover:text-sig-gray3 hidden md:block">
                        Cronologías
                    </div>
                    <div className="border border-sig-golden h-6 hidden md:block"></div>
                    <span className="material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer">
                        notifications
                    </span>
                    <span className="material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer">
                        more_vert
                    </span>
                </div>
            </div>
            <div className="flex gap-4 h-[40px] bg-sig-blue px-4 py-2 border-b-2 border-sig-golden md:hidden">
                <span
                    className={
                        expandedSider
                            ? "material-symbols-outlined text-sig-gray3 hover:text-white hover:cursor-pointer"
                            : "material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer"
                    }
                    onClick={(e) => setExpandedSider(!expandedSider)}
                >
                    menu
                </span>
                <div className="text-white font-medium hover:cursor-pointer">
                    Noticias
                </div>
                <div className="text-white font-medium hover:cursor-pointer">
                    Cronologías
                </div>
            </div>
        </div>
    );
};

export default Navbar;
