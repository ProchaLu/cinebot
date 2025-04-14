import dayjs from 'dayjs';
import Image from 'next/image';

type Props = {
  movies: {
    dates: {
      maximum: string;
      minimum: string;
    };
    page: number;
    results: {
      adult: boolean;
      backdrop_path: string;
      genre_ids: number[];
      id: number;
      original_language: string;
      original_title: string;
      overview: string;
      popularity: number;
      poster_path: string;
      release_date: string;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }[];
    total_pages: number;
    total_results: number;
  };
};

export default function MovieList({ movies }: Props) {
  return (
    <>
      <h2>Latest Movies</h2>
      <div>
        {dayjs(movies.dates.minimum).format('DD/MM/YYYY')} -
        {dayjs(movies.dates.maximum).format('DD/MM/YYYY')}
      </div>
      <div>
        {movies.results.map((result) => (
          <div key={`movie-id-${result.id}`}>
            {result.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                alt={result.title}
                width={500}
                height={750}
              />
            )}
            <div>
              <h3>{result.title}</h3>
              <div>
                {dayjs(result.release_date).format('MM/YYYY')} • ⭐{' '}
                {result.vote_average.toFixed(1)}
              </div>
              <div>{result.overview}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
