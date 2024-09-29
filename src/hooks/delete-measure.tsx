import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function DeleteMeasure({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () =>
      await fetch(`/api/measures/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
          description: "Medição deletada com sucesso",
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
