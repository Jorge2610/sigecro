import { cn } from "@/lib/utils";

type props = {
    children: React.ReactNode;
    className?: string;
};

const H1 = ({ children, className }: props) => {
    return (
        <h1
            className={cn(
                "font-lora text-3xl md:text-4xl font-medium",
                className
            )}
        >
            {children}
        </h1>
    );
};

const H2 = ({ children, className }: props) => {
    return (
        <h2 className={cn("font-lora font-medium mb-2 text-3xl", className)}>
            {children}
        </h2>
    );
};

const H3 = ({ children, className }: props) => {
    return (
        <h3 className={cn("font-lora font-medium text-xl", className)}>
            {children}
        </h3>
    );
};

const Head = ({ children }: props) => {
    return <p className="font-semibold text-sig-blue">{children}</p>;
};

export { H1, H2, H3, Head };
