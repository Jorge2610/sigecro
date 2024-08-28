"use client";
import Link from "next/link";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Popup, PopupState } from "@/components/ui/popup";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {
            message: "El nombre no puede estar vacío",
        })
        .max(64, {
            message: "El nombre no puede tener mas de 64 caracteres",
        }),
    description: z.string().max(500, {
        message: "La descripción no puede tener mas de 500 caracteres",
    }),
});

const CrearCategoria = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const formTag = useRef<HTMLFormElement>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    /**
     * Maneja el envío del formulario actualizando el estado del componente con los datos enviados.
     * data contiene los datos enviados del formulario.
     * Si los datos son guardados correctamente se dericciona a la pagina direcion "/categorias".
     * @return {Promise<void>} una promesa que se resuelve cuando se completa la operacion.
     */
    const setData = async (): Promise<void> => {
        const data = {
            name: form.getValues().name,
            description: form.getValues().description,
        };
        await axios
            .post("/api/categories", {
                data,
            })
            .then((response) => {
                router.push("/categorias");
                toast({
                    title: "Categoria guardada",
                    description: "La categoria se guardo correctamente.",
                });
            })
            .catch(function (error) {
                if (error.response == undefined) {
                    toast({
                        variant: "destructive",
                        title: "Error al guardar",
                        description: "Servidor no encontrado.",
                    });
                } else {
                    const status = error.response.request.status;
                    if (status == 503) {
                        toast({
                            variant: "destructive",
                            title: "Error al guardar",
                            description:
                                "Servidor de base de datos no encontrado",
                        });
                    } else {
                        if (status == 409) {
                            toast({
                                variant: "destructive",
                                title: "Error al guardar",
                                description: "La categoria ya existe",
                            });
                        } else {
                            toast({
                                variant: "destructive",
                                title: "Error al guardar",
                                description:
                                    "Hubo un error al guardar la categoria.",
                            });
                        }
                    }
                }
            });
    };
    return (
        <div>
            <h1 className="text-3xl pb-4"> Categoria</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(() => setOpen(true))}
                    className="space-y-4"
                    ref={formTag}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre*</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nombre"
                                        {...field}
                                        className="bg-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción"
                                        {...field}
                                        className="bg-white min-h-36"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className=" space-x-4 flex justify-end">
                        <Popup
                            title="Cancelar categoria"
                            description="Todos los cambios no guardados se perderán"
                            href="/categorias"
                        >
                            <Button variant={"outline"}>Cancelar</Button>
                        </Popup>
                        <Button type="submit">Aceptar</Button>
                        <PopupState
                            title="Registrar Categoria"
                            description="Esta seguro de registrar esta noticia"
                            openState={open}
                            onClose={() => setOpen(false)}
                            onConfirm={() => {
                                setData();
                                setOpen(false);
                            }}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CrearCategoria;
