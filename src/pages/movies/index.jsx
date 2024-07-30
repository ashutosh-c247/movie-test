import MoviePage from "../../components/Movies";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";

const MoviesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: movies, isLoading: isMovieListLoading } =
    trpc.movie.listMovies.useQuery({
      userEmail: session?.user?.email,
    });

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <MoviePage
      movies={movies ?? []}
      router={router}
      isLoading={isMovieListLoading}
    />
  );
};

export default MoviesPage;
