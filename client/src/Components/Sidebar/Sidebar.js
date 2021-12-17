import React,{useState} from "react";
import "./style.css";
import { Button } from "react-bootstrap";
import { matchGenre,userfollowing ,getRecommendedMovies, createUser} from "../../API/api";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Children",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Film-Noir",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

const users = [
"Jennifer Winters",
"Joe Leon",
"Emily Martinez",
"Cheryl Bautista",
"Victoria Colon",
"Brian Davis",
"Colton Gonzalez",
"Linda Alvarado",
"Cheryl Carr",
"Brian Reed",
 "John Fletcher",
 "Brooke Lang"

];

const Sidebar = (props) => {

  const [userState,setuserState]=useState([]); 

  const [genrestate,setgenreState]=useState([]); 

  const handlecheckBox=()=>{
     
    let genre_=[];
    for(let i=0;i<18;++i){

      let id_="genre"+genres[i]; 


      if(document.getElementById(id_).checked){
         genre_.push(genres[i]);
      }
    } 


    let users_=[];
    for(let i=0;i<12;++i){

      let id_="user"+users[i]; 

      if(document.getElementById(id_).checked){
         users_.push(users[i]);
      }
    } 


    setuserState(users_); 
    setgenreState(genre_);

    console.log(userState); 
    console.log(genrestate)
  }

  const handleClick = async (e) =>{

     e.preventDefault(); 
     handlecheckBox();

     let username = 'aman_bedi';

     console.log(username);

     if(genrestate.length>0){
         props.setLoading(true);
         matchGenre(genrestate,username);
         userfollowing(userState,username);
         props.setmovies([]);
         getRecommendedMovies(username).then(data=>{
           props.setmovies(data);
           props.setLoading(false)});
     }

  }

  return (
    <div className="root">
      <div className="heading">Choose Your Favourite Genre </div>
      <div className="Section">
        {genres.map((genre, idx) => (
          <div className="form-check form_"  key={idx}>
            <input
              className="form-check-input checkbox"
              type="checkbox"
              id={"genre"+genre}
              name="option1"
              value="something"
            ></input>
            <label className="form-check-label text">{genre}</label>
          </div>
        ))}
      </div>
      <div>
        <div className="heading">Follow other Users</div>
        <div className="Section">
          {users.map((user, idx) => (
            <div className="form-check form_" key={idx}>
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id={"user" + user}
                name="option1"
                value="something"
                key={idx}
              ></input>
              <label className="form-check-label text">{user}</label>
            </div>
          ))}
        </div>
        <Button className="button" variant="outline-secondary" size="lg" onClick={handleClick}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
