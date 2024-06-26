const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  },
  //Aqui dispongo las rutas para trabajar con el CRUD
  add: function (req, res) {
    Genres.findAll().then(function (genres) {
      res.render("moviesAdd.ejs", { allGenres: genres });
    });
  },
  create: function (req, res) {
    const { genre_id, length, release_date, awards, rating, title } = req.body;
    Movies.create(
      {
        genre_id,
        length,
        release_date,
        awards,
        rating,
        title,
      },
      { include: ["Genre"] }
    );
    res.redirect("/movies");
  },
  edit: function (req, res) {
    Promise.all([
      Movies.findByPk(req.params.id, { include: ["Genre"] }),
      Genres.findAll(),
    ]).then(function ([resultadoMovie, resultadoGenres]) {
      res.render("moviesEdit.ejs", {
        Movie: resultadoMovie,
        allGenres: resultadoGenres,
      });
    });
  },
  update: function (req, res) {
    const { genre_id, length, release_date, awards, rating, title } = req.body;
    Movies.update(
      {
        genre_id,
        length,
        release_date,
        awards,
        rating,
        title,
      },
      {
        where: { id: req.params.id },
      },
      {
        include: ["Genre"],
      }
    ),
      res.redirect("/movies");
  },
  delete: function (req, res) {
    Movies.findByPk(req.params.id).then(function (resultado) {
      res.render("moviesDelete.ejs", { Movie: resultado });
    });
  },
  destroy: function (req, res) {
    Movies.destroy({
      where: { id: req.params.id },
    });
    res.redirect("/movies");
  },
};

module.exports = moviesController;
