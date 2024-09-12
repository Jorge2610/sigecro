'use client'
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRef } from "react";
import { InputTextAreaForm } from "@/components/noticias/manual/InputFormText";


const Resumen=()=>{
    const text= useRef<HTMLTextAreaElement>(null);

    const setResumen= async():Promise<void>=>{
        const resumen=text?.current?.value;
        console.log("hola como anda");
        await axios.get('/api/news/resumen',{
            params:{text:resumen}
        } 
        ).then((response)=>{
            console.log(response);
            if(text.current){
                text.current.value=response.data;
            }        
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    return(
        <>
            <i>como estas </i>
            <Textarea placeholder="Coloca el texto aqui." ref={text}/>
            <Button onClick={()=>setResumen()}>Resumen</Button>
            
        </>
    )
}

export default Resumen;