import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import MovieCard from "../MovieCard/MovieCard";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading=(val)=>setIsLoading(val); 

  const setmovies = (val)=>setMovies(val);

  return isLoading ? (
    <div className="center">
    <CircularProgress size={100}></CircularProgress>
    <h4>Wait while we Recommend You Movies</h4>
    </div>
  ) : (
    <div className="main">
      <div className="top">
        <Sidebar setLoading={setLoading} setmovies={setmovies}></Sidebar>
      </div>
      <div className="line"></div>
      <div className="bottom">
        <div className="recommendedMovies">
          <div className="heading_">Movies you might like</div>
          <div className="moviecards">
              {
                movies.map((movie,idx)=>(
                  <MovieCard key={idx} movie={movie}></MovieCard>
                ))
              }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
