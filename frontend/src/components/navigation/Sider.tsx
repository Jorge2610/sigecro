"use client";

import SiderOption from "./SiderOption";
import { Separator } from "@/components/ui/separator";

const Sider = ({
    isExpanded,
    setExpandedSider,
}: {
    isExpanded: boolean;
    setExpandedSider: any;
}) => {
    const options = [
        {
            link: "/administrar-noticias",
            icon: "news",
            text: "Noticias",
        },
        { link: "/roles", icon: "manage_accounts", text: "Roles" },
        { link: "/categorias", icon: "label", text: "Categorias" },
    ];

    const resetExpandedState = () => {
        setExpandedSider(false);
    };

    const getSiderClass = () => {
        let baseClass =
            "absolute flex flex-col w-[100svw] md:h-[calc(100svh-100px)] rounded-b-lg md:rounded-none transition-all duration-300 ease-in-out bg-sig-gray2 z-20 ";
        return isExpanded
            ? baseClass + `h-[166px] md:w-[240px]`
            : baseClass + "h-0 md:w-[60px]";
    };

    return (
        <div className="fixed top-[100px] md:top-[60px]">
            <div className={getSiderClass()}>
                <div
                    title="Administrar"
                    className="flex items-center gap-4 pl-4 bg-sig-gray2 font-semibold text-sig-hblue mt-2 overflow-hidden"
                >
                    <span className="material-symbols-outlined text-sig-hblue">
                        security
                    </span>
                    <span
                        className={
                            "transition-all duration-300 ease-in-out " +
                            (isExpanded ? "opacity-100" : "opacity-0")
                        }
                    >
                        {isExpanded ? "ADMINISTRAR" : ""}
                    </span>
                </div>
                <div className="overflow-hidden">
                    <Separator className="bg-sig-blue my-2" />
                </div>
                <div className="bg-sig-gray2 mb-2 overflow-hidden">
                    {options.map((option) => {
                        return (
                            <SiderOption
                                key={option.text}
                                link={option.link}
                                icon={option.icon}
                                text={option.text}
                                expanded={isExpanded}
                                resetExpanded={resetExpandedState}
                            />
                        );
                    })}
                </div>
            </div>
            <div
                className={
                    isExpanded
                        ? "absolute h-[100svh] w-[100svw] transition-opacity duration-300 ease-in-out bg-black/65 z-10"
                        : "opacity-0"
                }
                onClick={(e) => setExpandedSider(!isExpanded)}
            ></div>
        </div>
    );
};

export default Sider;
