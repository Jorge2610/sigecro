import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function SiderOption({ link, icon, text, expanded }: { link: string, icon: string, text: string , expanded: boolean}) {
    return (
        <Button asChild className="flex-none justify-start w-full font-medium" variant={"ghost"} title={text}>
            <Link href={link}>
                <span className="material-symbols-outlined text-sig-blue hover:cursor-pointer hover:text-sig-hblue me-4">{icon}</span>
                {expanded ? text : ''}
            </Link>
        </Button>
    );
}