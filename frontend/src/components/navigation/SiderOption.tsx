import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SiderOption = ({
    link,
    icon,
    text,
    expanded,
    resetExpanded,
}: {
    link: string;
    icon: string;
    text: string;
    expanded: boolean;
    resetExpanded: () => void;
}) => {
    const isSelected = usePathname().includes(link);

    return (
        <div className="bg-sig-gray2">
            <Button
                asChild
                className="flex-none justify-start w-full font-medium"
                variant={isSelected ? "default" : "ghost"}
                title={text}
                onClick={resetExpanded}
            >
                <Link href={link}>
                    <span
                        className={
                            "material-symbols-outlined hover:cursor-pointer me-4" +
                            (isSelected
                                ? " text-sig-white"
                                : " text-sig-blue hover:text-sig-hblue ")
                        }
                    >
                        {icon}
                    </span>
                    <span
                        className={
                            "transition-all duration-300 ease-in-out " +
                            (expanded ? "opacity-100" : "opacity-0")
                        }
                    >
                        {expanded ? text : ""}
                    </span>
                </Link>
            </Button>
        </div>
    );
};

export default SiderOption;
