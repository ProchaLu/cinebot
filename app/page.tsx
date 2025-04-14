import MovieList from './MovieList';

export default async function Home() {
  const response = await fetch(
    'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MOVIE_DB_API_KEY}`,
      },
    },
  );

  const data = await response.json();

  console.log(data);

  return (
    <div>
      <div>The Movie Page?</div>
      <MovieList movies={data} />
    </div>
  );
}
