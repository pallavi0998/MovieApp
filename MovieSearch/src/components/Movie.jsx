import React, { useEffect, useState } from 'react'
import "./Movie.css";
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

export default function Movie() {

  const [sortBy, setSortBy] = useState('popularity.desc');
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [favorites, setFavorites] = useState([]);


  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);
  

  const toggleFavorite = (movie) => {
    let updatedFavorites;
    
    if (favorites.some((fav) => fav.id === movie.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }
  
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  



  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        {
          params: {
            api_key: 'cab88900b2b1ddc93a54791fdab67349',
          },
        }
      );
      setGenres(response.data.genres);
      console.log(response.data.genres);

    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        {
          params: {
            api_key: 'cab88900b2b1ddc93a54791fdab67349',
            sort_by: sortBy,
            page: 1,
            with_genres: selectedGenre,
            query: searchQuery,
          },
        }
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }


  const handleSearchSubmit = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          api_key: 'cab88900b2b1ddc93a54791fdab67349',
          query: searchQuery,
        }
      }
    );
    setMovies(response.data.results);
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  }

  const handleSelectedChange = (e) => {
    setSelectedGenre(e.target.value);
  }

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  }

  return (
    <div>
      <h1>Movie House</h1>
      <div className='search-bar'>
        <input type='text' placeholder='Search Movie...' value={searchQuery} onChange={handleSearchChange} className='search-input' ></input>
        <button onClick={handleSearchSubmit} className='search-button'>
          <AiOutlineSearch />
        </button>
      </div>
      <div className='filters'>
        <label htmlFor='sort-by'>Sort By:</label>
        <select id='sort-by' value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleSelectedChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        </div>
        <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p className='rating'>Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggleDescription(movie.id)} className='read-more'>
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
            <button onClick={() => toggleFavorite(movie)} className='favorite-button'>
        {favorites.some((fav) => fav.id === movie.id) ? "Remove from Favorites" : "Add to Favorites"}
      </button>
          </div>
        ))}
      </div>

      {/* ✅ Favorites Section */}
<div className="favorites-section">
  <h2>My Favorites</h2>
  <div className="movie-wrapper">
    {favorites.length > 0 ? (
      favorites.map((movie) => (
        <div key={movie.id} className="movie">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <h2>{movie.title}</h2>
          <button onClick={() => toggleFavorite(movie)} className='favorite-button'>
            Remove from Favorites
          </button>
        </div>
      ))
    ) : (
      <p>No favorite movies added yet.</p>
    )}
  </div>
</div>
    </div>
  );
};
