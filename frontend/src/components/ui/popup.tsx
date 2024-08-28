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
    action?: () => void;
    children?: React.ReactNode;
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
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    {href ? (
                        <Link href={href} className="w-auto">
                            <AlertDialogAction
                                onClick={action}
                                className="w-full"
                            >
                                Aceptar
                            </AlertDialogAction>
                        </Link>
                    ) : (
                        <AlertDialogAction onClick={action}>
                            Aceptar
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

interface PropsState {
    onConfirm: () => void;
    title: string;
    description: string;
    href?: string;
    openState: boolean;
    onClose: () => void;
}

const PopupState = ({
    onConfirm,
    title,
    description,
    href,
    onClose,
    openState,
}: PropsState) => {
    return (
        <AlertDialog open={openState}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Cancelar
                    </AlertDialogCancel>
                    {href ? (
                        <Link href={href} className="w-auto">
                            <AlertDialogAction
                                onClick={onConfirm}
                                className="w-full"
                            >
                                Aceptar
                            </AlertDialogAction>
                        </Link>
                    ) : (
                        <AlertDialogAction onClick={onConfirm}>
                            Aceptar
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export { Popup, PopupState };
