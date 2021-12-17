const routes = require('express').Router();
const controllers = require('../Controllers/controllers.js'); 

routes.post('/signup',controllers.createUser);

routes.post('/signin',controllers.getUser);

routes.post('/match_genre',controllers.matchGenre);

routes.post('/userfollowing',controllers.generateFollow);

routes.get('/',controllers.getUsers);

routes.get('/recommend',controllers.recommendMovies);

module.exports  = routes;