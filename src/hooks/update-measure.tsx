import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function UpdateMeasure({
  id,
  onClose,
}: {
  id: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ confirmed_value }: { confirmed_value: number }) =>
      await fetch(`/api/measures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed_value,
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
          description: "Medição atualizada com sucesso",
        });
        if (onClose) onClose();
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
