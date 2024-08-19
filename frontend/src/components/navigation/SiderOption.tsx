import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiderOption({
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
}) {
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
              isSelected
                ? "material-symbols-outlined text-sig-white hover:cursor-pointer me-4"
                : "material-symbols-outlined text-sig-blue hover:cursor-pointer hover:text-sig-hblue me-4"
            }
          >
            {icon}
          </span>
          {expanded ? text : ""}
        </Link>
      </Button>
    </div>
  );
}
