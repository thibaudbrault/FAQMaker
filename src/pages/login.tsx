import { Button, Input, Label } from "@/components";
import { LoginValidator } from "@/utils/validators/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginCredentials = z.infer<typeof LoginValidator>;

function Login() {
  const router = useRouter();
  const [isShown, setIsShown] = useState<boolean>(false);

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
    <main className="bg-gradient-to-br from-lime-50 via-emerald-200 to-teal-700">
      <section className="flex justify-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-1/3">
        <div className="bg-green-50 px-8 py-20 rounded-md flex flex-col items-center w-full">
          <h2
            className="font-serif text-5xl lowercase mb-8 font-bold"
            style={{ fontVariant: "small-caps" }}
          >
            Login
          </h2>
          <form
            onSubmit={handleSubmit((values) => loginHandler(values))}
            className="flex flex-col gap-8 w-full"
          >
            <fieldset className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" style={{ fontVariant: "small-caps" }}>
                  email
                </Label>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email"
                  maxLength={48}
                  className="w-full bg-transparent p-1 border border-transparent border-b-teal-700 outline-none focus:border-teal-700 focus:rounded-md placeholder:text-stone-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" style={{ fontVariant: "small-caps" }}>
                  password
                </Label>
                <div className=" flex items-center justify-between bg-transparent p-1 border border-transparent border-b-teal-700">
                  <Input
                    {...register("password", { required: true })}
                    type={isShown ? "text" : "password"}
                    placeholder="Password"
                    maxLength={48}
                    className="w-full bg-transparent pr-6 outline-none focus:border-teal-700 focus:rounded-md placeholder:text-stone-500"
                  />
                  <button type="button" onClick={() => setIsShown(!isShown)}>
                    {isShown ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </fieldset>
            <Button
              variant="primaryDark"
              size="full"
              font="large"
              weight="bold"
              type="submit"
              style={{ fontVariant: "small-caps" }}
            >
              submit
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
