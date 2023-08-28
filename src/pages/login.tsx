import { LoginValidator } from "@/utils/validators/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginCredentials = z.infer<typeof LoginValidator>;

function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginValidator),
  });

  const { mutate: loginHandler, isLoading } = useMutation({
    mutationFn: async (values: LoginCredentials) => {
      try {
        await signIn(`credentials`, { ...values, callbackUrl: `/` });
        await router.push(`/`);
        // successToast(`You are logged in`);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error);
          //   errorToast(error.response?.data.message);
        }
      }
    },
  });

  return (
    <section>
      <form onSubmit={handleSubmit((values) => loginHandler(values))}>
        <input {...register("email")} type="email" placeholder="Email" />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default Login;
