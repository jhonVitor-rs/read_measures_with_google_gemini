"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertFileToBase64 } from "@/hooks/transform-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import { ChangeEvent, forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateMeasure } from "@/hooks/create-measure";

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const measureSchema = z.object({
  image: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Nenhuma imagem foi selecionada.",
    })
    .transform((list) => list.item(0))
    .refine((file) => {
      return file!.size <= 1024 * 1024 * 5;
    }, "Tamanho maximo da imagem é de 5 MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file!.type),
      "Somente os formatos .jpg, .jpeg, .png e .webp são suportados",
    )
    .transform(async (file) => {
      const base64 = await convertFileToBase64(file!);
      return base64;
    }),
  date: z.date().transform((date) => date.toISOString()),
  type: z.enum(["WATER", "GAS"]),
});

export const NewMeasureForm = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; onClose: () => void }
>(({ children, onClose }, ref) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [sending, setSending] = useState(false);
  const mutation = CreateMeasure({ onClose });

  const form = useForm<z.infer<typeof measureSchema>>({
    resolver: zodResolver(measureSchema),
    defaultValues: {
      image: undefined,
      date: undefined,
      type: "WATER",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setSending(true);
    mutation.mutate({
      image: data.image,
      measure_datetime: data.date,
      measure_type: data.type,
    });
    router.refresh();
    setSending(false);
  });

  const onOpenChange = () => {
    setOpenCalendar(false);
    form.reset({
      image: undefined,
      date: undefined,
      type: "WATER",
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files;
    console.log(fileInput);
    if (fileInput && fileInput.length > 0) {
      const selectedFile = fileInput[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent className="bg-black shadow shadow-primary">
        <DialogHeader>
          <DialogTitle>Adicione uma nova medição</DialogTitle>
          <DialogDescription>
            Utilize este formulário para adicionar novas medições a tabela
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex items-center justify-center gap-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="max-w-1/3">
                    <FormLabel>Tipo de medição</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Qual o tipo da medição?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WATER">Água</SelectItem>
                        <SelectItem value="GAS">Gás</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Você pode enviar mdições de água ou gás
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Selecione a data da mdição</FormLabel>
                    <Popover open={openCalendar}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            onClick={() => setOpenCalendar(!openCalendar)}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />{" "}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(e) => {
                            field.onChange(e);
                            setOpenCalendar(false);
                          }}
                          disabled={(date) => {
                            const currentDate = new Date();
                            const endOfMonth = new Date(
                              currentDate.getFullYear(),
                              currentDate.getMonth() + 1,
                              0,
                            );

                            return (
                              date > endOfMonth || date < new Date("1900-01-01")
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Selecione a data em que a medição foi realizada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full items-center justify-center">
                        <Image
                          className="rounded-md border-2 bg-transparent shadow-md shadow-primary"
                          src={selectedImage}
                          width={200}
                          height={200}
                          alt={""}
                        />
                        <PlusIcon className="absolute size-24" />
                        <Input
                          type="file"
                          id="img"
                          accept="image/*"
                          onBlur={field.onBlur}
                          name={field.name}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleImageChange(e);
                          }}
                          ref={field.ref}
                          className="absolute h-[200px] w-[200px] opacity-0"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={sending}>
                {sending ? "Enviando" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

NewMeasureForm.displayName = "NewMeasureForm";
