import axios from 'axios'; 


export const createUser = async(username) =>{ 
    try{
        await axios.post('http://localhost:8000/user/signup',username);
    } 
    catch(err){
        console.error(err);
    }
}

export const matchGenre = async(genres,username) =>{

    
    try{ 
        const data={
            genre:genres,
            username:"aman_bedi" 
        }
        const response = await axios.post(`http://localhost:8000/user/match_genre`,data);
    }
    catch(err){
        console.error(err);
    }
}

export const userfollowing =async(users,username)=>{
    try{ 
        const data={
            followers:users,
            username:username,
        }
        const response = await axios.post(`http://localhost:8000/user/userfollowing`,data);
    }
    catch(err){
        console.log(err);
    }
}

export const getUsers = async()=>{
    try{
        const {data} = await axios.get("http://localhost:8000/user"); 
        let data_=[];
        for(let i=0;i<data.response.length;++i){
            data_.push(data.response[i]._fields[0].properties.username); 
        } 
        console.log(data_);

        return data_;
    }
    catch(err){
        console.log(err);
    } 

}

export const getRecommendedMovies = async(username)=>{
    
    try{
       const {data} = await axios.get(`http://localhost:8000/user/recommend?username=${username}`); 

       const x = (data.data); 
    
       for(let i=0;i<x.length;++i){
           console.log(x[i]);
       }
       return x;
    } 
    catch(err){
        console.error(err);
    }
}