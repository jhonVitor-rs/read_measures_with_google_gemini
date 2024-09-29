import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function CreateMeasure({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      image,
      measure_datetime,
      measure_type,
    }: {
      image: string;
      measure_datetime: string;
      measure_type: "WATER" | "GAS";
    }) =>
      await fetch("/api/measures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          measure_datetime,
          measure_type,
        }),
      }),
    onSuccess: async (response) => {
      const responseData = await response.json();
      if (!response.ok) {
        toast({
          title: responseData.error_code,
          description: responseData.error_description,
          variant: "destructive",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["measures"] });
        toast({
          title: "Sucesso",
          description: "Medição criada com sucesso",
        });
        onClose();
      }
    },
    onError: (error) => {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
}
