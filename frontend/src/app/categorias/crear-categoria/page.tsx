"use client"
import Link from 'next/link'
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Popup from "@/components/ui/popup"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRef } from 'react';

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre no puede estar vacío",
  }).max(64,{
    message: "El nombre no puede tener mas de 64 caracteres"
  }),
  description: z.string().max(500,{
    message: "La descripción no puede tener mas de 500 caracteres",
  }),
})

export default function ProfileForm() {
  const { toast } = useToast();
  const formTag = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          description:"",
        },
  })

const onSubmit= async(data: z.infer<typeof formSchema>) =>{
  formTag.current?
    formTag.current.submit:console.log('no se encontro la etiqueta form');
  await axios.post("/api/categories",{
    data
  }).then((response)=>{
    console.log(response)
    toast({
      title: "Categoria guardada",
      description: "La categoria se guardo correctamente.",
    })
  }).catch(function (error) {
    if(error.response==undefined){
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "Servidor no encontrado."
      })
    }else{
      const status=error.response.request.status;
      if(status==503){
        toast({
          variant: "destructive",
          title: "Error al guardar",
          description: "Servidor de base de datos no encontrado"
        })
      }else{if(status==409){
        toast({
          variant: "destructive",
          title: "Error al guardar",
          description: "La categoria ya existe"
        })
        }else{
          toast({
          variant: "destructive",
          title: "Error al guardar",
          description: "Hubo un error al guardar la categoria."
        })}
        
      }

    }
    console.log(error.response)
    console.log(error==undefined)
  })}
  return (
    <div>
        <h1 className="text-3xl pb-4"> Categoria</h1>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(
        onSubmit)} className="space-y-4" ref={formTag}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre*</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} 
                  className="bg-white"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción" {...field}
                  className="bg-white min-h-36"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=' space-x-4 flex justify-end'>

          <Button asChild variant={"ghost"}>
            <Link href="/">Cancelar</Link>
          </Button>
          <Popup
          title='Registrar Categoria'
          description='Esta seguro de registrar esta noticia'
          action={()=>{
            if(formTag.current){
                formTag.current.requestSubmit();
            }
          }}>
            <Button >Aceptar</Button>
          </Popup>
        </div>
      </form>
    </Form>
    </div>
  )
}
