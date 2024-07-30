import React, { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import MovieForm from "../../../components/Form/MovieForm";

const CreateMovie = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const { mutateAsync: createMovie, isLoading: isMovieCreating } =
    trpc.movie.createMovie.useMutation({
      onSuccess: () => {
        toast.success("Movie created successfully", {
          position: "bottom-center",
        });
        router.push("/movies");
      },
      onError: (error) => {
        toast.error(error.message, {
          position: "bottom-center",
        });
      },
    });

  const handleSubmit = async (formData) => {
    await createMovie({
      userEmail: session?.user?.email,
      title: formData.title,
      poster: formData.poster,
      publishingYear: formData.publishingYear,
    });
  };

  return (
    <MovieForm
      onSubmit={handleSubmit}
      isLoading={isMovieCreating}
      router={router}
    />
  );
};

export default CreateMovie;
