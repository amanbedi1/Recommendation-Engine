const neo4j = require("neo4j-driver");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const driver = neo4j.driver(
  process.env.dbUrl,
  neo4j.auth.basic("neo4j", "devil@4444")
);

const createUser = async (req, res) => {
  const session = driver.session();

  const {username} = req.body;

  console.log(username);

  try {
    const response = await session.run(
      "CREATE (n:User {userId:$id_,username:$name})",
      {
        id_: "1357855",
        name: username,
      }
    );
    res
      .status(201)
      .json({ message: "succesfully Created", username: username });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

const getUser = async (req, res) => {
  const session = driver.session();

  const { username } = req.body;

  try {
    const response = await session.run(
      "MATCH (n:User) WHERE (n.username=$name) return n",
      {
        name: username,
      }
    );

    if (response.records.length === 0) {
      return res.status(200).json({ message: "Invalid Credentials" });
    }

    return res.status(200).json({
      message: "successfull",
      username: response.records[0]._fields[0].properties.username,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something Went Wrong" });
  } finally {
    await session.close();
  }
};

const getUsers = async (req, res) => {
  const session = driver.session();

  try {
    const response = await session.run("MATCH (n:User) return n limit 12");
    console.log(response);

    return res.status(200).json({ response: response.records });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Server Error" });
  } finally {
    await session.close();
  }
};

const matchGenre = async (req, res) => {
  console.log(req.body);

  const { genre, username } = req.body;

  const session = driver.session();

  try {
    const response = await session.run(
      "MATCH (n:User) WHERE (n.username=$name) return n",
      {
        name: username,
      }
    );

    if (response.records.length < 0) {
      return res.status(200).json({ message: "Invalid Credentials" });
    }

    for (let i = 0; i < genre.length; ++i) {
      await session.run(
        "MATCH (u:User),(g:Genre) where (u.username=$name) and (g.genre=$genre_) CREATE (u)-[:LIKES]->(g)",
        {
          name: username,
          genre_: genre[i],
        }
      );
    }
    return res.status(201).json({ message: "Realtions Succesfully Created" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something Went Wrong" });
  } finally {
    await session.close();
  }
};

const generateFollow = async (req, res) => {
  const { followers, username } = req.body;

  const session = driver.session();

  console.log(followers);
  console.log(username);

  try {
    const response = await session.run(
      "MATCH (n:User) WHERE (n.username=$name) return n",
      {
        name: username,
      }
    );

    if (response.records.length < 0) {
      return res.status(200).json({ message: "User not Found" });
    }

    for (let i = 0; i < followers.length; ++i) {
      await session.run(
        "MATCH (u:User),(u_:User) WHERE (u.username=$username_) and (u_.username=$following_) CREATE (u)-[:FOLLOWS]->(u_)",
        {
          following_: followers[i],
          username_: username,
        }
      );
    }

    return res.status(200).json({ message: "Relation Successfully Created" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Some thing Went Wrong" });
  } finally {
    await session.close();
  }
};

const getPoster = async (id) => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=4898a86db414df0fea9eef99835af3ef`
    );
    if (!data) {
      return "";
    }
    const posters = data.posters[0].file_path;

    return "https://image.tmdb.org/t/p/w200//" + posters;
  } catch (error) {
    return "";
  }
};

const getGenre = async (movieName) =>{

    const session = driver.session(); 

    try{
        const response = await session.run("MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre) where m.title=$name return g.genre",{
            name:movieName
        }) 
        
        let s="";
        if(response.records[0]._fields[0]){
            s=response.records[0]._fields[0]; 

        }
        if(response.records.length>1){
            s=s+"  "+response.records[1]._fields[0];
        } 
        return s;

    }
    catch(error){
        return "";
    }
}

const recommendMovies = async (req, res) => {
  const username = req.query.username;

  const session = driver.session();

  console.log(username);

  let data= await getGenre("Elling (2001)"); 

  try {

    let response = await session.run(
      "MATCH (n:User {username:$username_})-[:FOLLOWS]->(u2:User)-[:WATCHED]->(m:Movie)-[:HAS_GENRE]->(g:Genre)<-[:LIKES]-(n) return distinct m.title,m.rating,m.tmdbId order by m.rating descending limit 28",
      {
        username_: username,
      }
    );

    const data = [];

    if (response.records.length === 0) {
      response = await session.run(
        "MATCH (n:User {username:$username_})-[:LIKES]->(g:Genre)<-[:HAS_GENRE]-(m:Movie) where m.rating>4.5  return distinct m.title,m.rating,m.tmdbId order by m.rating descending limit 28",
        {
          username_: username,
        }
      );
    }

    if (response.records.length === 0) {
      console.log("Error Database Error");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    for (let i = 0; i < response.records.length; ++i) {
      let { keys, _fields } = response.records[i];

      let obj = {};

      obj["title"] = _fields[0];
      obj["rating"] = _fields[1];
      obj["genre"] = await getGenre(_fields[0]);


      obj['imgsrc']= await getPoster(parseInt(_fields[2]));

      data.push(obj);
    }

    console.log(data); 

    await session.run("MATCH (n:User{username:$name}) -[r:FOLLOWS]->() delete r",{
      name:username,
    }) 

    await session.run("MATCH (n:User{username:$name}) -[r:LIKES]->() delete r",{
      name:username,
    }) 

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "unknown error" });
  } finally {
    await session.close();
  }
};

module.exports = {
  createUser,
  getUser,
  matchGenre,
  generateFollow,
  getUsers,
  recommendMovies,
};
