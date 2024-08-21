import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface Props {
  action: () => void;
  children: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}
const Popup = ({ action, title, description, children, href }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {href ? (
            <Link href={href} className="w-auto">
              <AlertDialogAction onClick={action} className="w-full">
                {" "}
                Aceptar{" "}
              </AlertDialogAction>
            </Link>
          ) : (
            <AlertDialogAction onClick={action}>Aceptar</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Popup;
