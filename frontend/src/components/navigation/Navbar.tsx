"use client";

import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
    expandedSider: boolean;
    setExpandedSider: (expanded: boolean) => void;
};

const Navbar = ({ expandedSider, setExpandedSider }: NavbarProps) => {
    /**
     * Renders the navigation links.
     *
     * This component is not displayed in mobile devices.
     *
     * @returns A JSX element with the navigation links.
     */
    const renderNavLinks = (): JSX.Element => (
        <>
            <Link href="/noticias">
                <div className="text-lg font-semibold text-white hover:cursor-pointer hover:text-sig-gray3 hidden md:block">
                    Noticias
                </div>
            </Link>
            <div className="text-lg font-semibold text-white hover:cursor-pointer hover:text-sig-gray3 hidden md:block">
                Cronologías
            </div>
        </>
    );

    /**
     * Renders the icons in the navbar.
     *
     * This function renders the notifications and more_vert icons in the navbar.
     * The icons are displayed in a white color and when hovered, they change to a golden color.
     * The icons are also clickable and the cursor changes to a pointer when hovered.
     *
     * @returns A JSX element with the icons.
     */
    const renderIcons = (): JSX.Element => (
        <>
            <span className="material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer">
                notifications
            </span>
            <span className="material-symbols-outlined text-sig-golden hover:text-white hover:cursor-pointer">
                more_vert
            </span>
        </>
    );

    /**
     * Handles the click event on the menu button.
     *
     * This function changes the state of the expandedSider state variable.
     * When the menu button is clicked, the expandedSider state variable is set to its opposite value.
     * If the menu is open, it will be closed and vice versa.
     */
    const handleMenuClick = (): void => {
        setExpandedSider(!expandedSider);
    };

    return (
        <div className="fixed top-0 z-10 w-full h-[100px] md:h-[60px]">
            <div className="flex justify-between h-[60px] bg-sig-purple px-4 py-2.5 border-b-2 border-sig-golden">
                <div className="flex items-center gap-4 h-[40px] hover:cursor-pointer">
                    <div className="hidden md:block h-6">
                        <span
                            className={`material-symbols-outlined ${
                                expandedSider
                                    ? "text-sig-gray3"
                                    : "text-sig-golden"
                            } hover:text-white hover:cursor-pointer`}
                            onClick={handleMenuClick}
                        >
                            menu
                        </span>
                    </div>

                    <Link href="/">
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
                    {renderNavLinks()}
                    <div className="border border-sig-golden h-6 hidden md:block"></div>
                    {renderIcons()}
                </div>
            </div>

            <div className="flex gap-4 h-[40px] bg-sig-blue px-4 py-2 border-b-2 border-sig-golden md:hidden">
                <span
                    className={`material-symbols-outlined ${
                        expandedSider ? "text-sig-gray3" : "text-sig-golden"
                    } hover:text-white hover:cursor-pointer`}
                    onClick={handleMenuClick}
                >
                    menu
                </span>
                <div className="text-white font-medium hover:cursor-pointer">
                    <Link href="/noticias">Noticias</Link>
                </div>
                <div className="text-white font-medium hover:cursor-pointer">
                    Cronologías
                </div>
            </div>
        </div>
    );
};

export default Navbar;
