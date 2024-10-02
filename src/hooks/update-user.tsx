import { UpdateUser } from "@/app/app/_user-components/actions";
import { SignInAssistant } from "@/app/auth/actions";
import { User } from "@/services/db/schemas/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function UpdateUserMutation(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      user,
      newPassword,
    }: {
      user: Partial<User>;
      newPassword?: string;
    }) => UpdateUser(id, user, newPassword),
    onSuccess: async (data) => {
      queryClient.setQueryData<User>(["user", id], (prevUser) => ({
        ...prevUser,
        ...data,
      }));

      await SignInAssistant({ email: data.email, password: data.password });
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso",
      });
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
