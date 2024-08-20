import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import AutomaticPreview from "./AutomaticPreview";
import { NewsData } from "./newsInterfaces";

export default function RegistroAutomatico() {
  const [newsData, setNewsData] = useState<NewsData>();

  const formSchema = z.object({
    url: z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
      message: "La URL ingresada no es válida",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_HOST}/news/scraping`, {
        url: values.url,
      })
      .then((response) => {
        const data: NewsData = {
          url: response.data.url,
          title: response.data.title,
          dateTime: new Date(response.data.dateTime),
          source: response.data.source,
          content: response.data.content,
        };
        setNewsData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL*</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Extraer</Button>
          </div>
        </form>
      </Form>
      <Separator className="my-4" />
      {newsData !== undefined ? <AutomaticPreview newsData={newsData} /> : ""}
    </div>
  );
}
