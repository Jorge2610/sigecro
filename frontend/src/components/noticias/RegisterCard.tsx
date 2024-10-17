import { Button } from "@/components/ui/button";
import Link from "next/link";
import { H2 } from "../ui/headings";

interface RegisterCardProps {
    icon: string;
    title: string;
    description: string;
    href: string;
    buttonText: string;
    secondHref?: string;
    secondButtonText?: string;
}

const RegisterCard = ({
    icon,
    title,
    description,
    href,
    buttonText,
    secondHref = "",
    secondButtonText = "",
}: RegisterCardProps) => {
    return (
        <div className="bg-white p-4 flex flex-col gap-4 rounded border border-slate-200">
            <div className="flex items-center gap-4">
                <span
                    className="material-symbols-outlined text-sig-blue"
                    style={{ fontSize: "48px" }}
                >
                    {icon}
                </span>
                <H2 className=" text-sig-text">{title}</H2>
            </div>
            <p className="grow whitespace-pre-wrap">{description}</p>
            <div className="flex justify-end gap-4">
                {secondHref && (
                    <Button asChild variant={"outline"}>
                        <a href={secondHref}>{secondButtonText}</a>
                    </Button>
                )}
                <Button asChild>
                    <a href={href}>{buttonText}</a>
                </Button>
            </div>
        </div>
    );
};

export default RegisterCard;
