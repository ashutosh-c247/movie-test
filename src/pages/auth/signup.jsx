import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const signupValidationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupValidationSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const createUser = trpc.auth.registerUser.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      toast.success("User created successfully", {
        position: "bottom-center",
      });
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    await createUser.mutateAsync(data);
  };

  return (
    <div className="w-full h-screen flex-col justify-center items-center inline-flex">
      <form className="w-[300px] relative" onSubmit={handleSubmit(onSubmit)}>
        <div className="left-[37px] top-0  text-center text-white text-[64px] font-semibold leading-[80px] mb-8">
          Sign up
        </div>
        <div className="w-[300px] h-[45px] left-0 top-[120px] mb-[24px]">
          <input
            placeholder="First Name"
            type="text"
            {...register("firstName")}
            className="w-[300px] h-[45px] left-0 top-0  bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
          />
          {errors.firstName && (
            <p className="text-rose-500 font-semibold text-xs py-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="w-[300px] h-[45px] left-0 top-[120px] mb-[24px]">
          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="w-[300px] h-[45px] left-0 top-0  bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
          />
          {errors.lastName && (
            <p className="text-rose-500 font-semibold text-xs py-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div className="w-[300px] h-[45px] left-0 top-[120px] mb-[24px]">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-[300px] h-[45px] left-0 top-0  bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
          />
          {errors.email && (
            <p className="text-rose-500 font-semibold text-xs py-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="w-[300px] h-[45px] left-0 top-[120px] mb-[24px]">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-[300px] h-[45px] left-0 top-0  bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
          />
          {errors.password && (
            <p className="text-rose-500 font-semibold text-xs py-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          className="w-[300px] h-[54px] py-[15px] left-0 top-[306px]  bg-[#2BD17E] rounded-[10px] justify-center cursor-pointer items-center gap-[5px] inline-flex text-center text-white text-base font-bold leading-normal hover:bg-emerald-500"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing up..." : "Sign Up"}
        </button>
        <p className="left-[37px] top-[250px]  text-center text-white text-[12px] font-semibold leading-[80px]">
          Already have an account? <Link href="/">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/movies",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
