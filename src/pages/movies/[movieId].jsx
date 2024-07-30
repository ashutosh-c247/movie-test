import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import MovieForm from "../../components/Form/MovieForm";

const EditMovie = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const { data: session } = useSession();
  const { data, isLoading: isMovieLoading } = trpc.movie.getMovieById.useQuery(
    {
      movieId: movieId,
    },
    {
      enabled: !!movieId,
    }
  );

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const { mutateAsync: updateMovie, isLoading: isMovieUpdating } =
    trpc.movie.updateMovie.useMutation({
      onSuccess: () => {
        toast.success("Movie updated successfully", {
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
    await updateMovie({
      movieId: movieId,
      poster: formData.poster,
      title: formData.title,
      publishingYear: formData.publishingYear,
    });
  };

  return (
    <MovieForm
      initialData={data}
      onSubmit={handleSubmit}
      isLoading={isMovieUpdating}
      isDataLoading={isMovieLoading}
      router={router}
    />
  );
};

export default EditMovie;
