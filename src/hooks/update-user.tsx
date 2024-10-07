import { UpdateUser } from "@/app/app/_user-components/actions";
import { SignInAssistant } from "@/app/auth/actions";
import { User } from "@/services/db/schemas/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UpdateUserMutation(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ user }: { user: Partial<User> }) => UpdateUser(id, user),
    onSuccess: async (data) => {
      queryClient.setQueryData<User>(["user", id], (prevUser) => ({
        ...prevUser,
        ...data,
      }));

      await SignInAssistant({ email: data.email, password: data.password });
    },
  });

  return mutation;
}
