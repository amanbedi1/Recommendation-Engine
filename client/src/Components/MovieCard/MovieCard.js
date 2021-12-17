import React from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import img_ from "../../assets/logo512.png";

const Styles = makeStyles((theme) => ({

  // root_:{
  //   height: "40%",
  //   width: "100%",
  //   marginRight:"20px",
  // },
  root: {
    height: "90%",
    width: "15.5rem",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    margin:"20px",
    [theme.breakpoints.down("500")]: {
      margin: "10px 20px",
    },
  },
  media: {
    paddingTop: "90%",
  },
  overlay: {
    position: "absolute",
    top: "6px",
    left: "16px",
    color: "white",
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const MovieCard = (props) => {
  const classes = Styles();

  return (
    <div className={classes.root_}>
      <Card className={classes.root} raised>
        <CardMedia
          className={classes.media}
          image={props.movie.imgsrc || "https://via.placeholder.com/150C/O https://placeholder.com/"}
          title={props.movie.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{props.movie.creator}</Typography>
        </div>
        <CardContent className={classes.cardContent}>
          <Typography variant="body2" color="textSecondary">
            {props.movie.genre}
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.title}
          >
            {props.movie.title}
          </Typography>
        </CardContent>
        <CardActions className={classes.footer}>
          <Button size="medium" color="primary">
            Watch
          </Button>
          <Typography vaariant="body2" color="primary">
            Rating:{Math.floor(props.movie.rating)}
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
};

export default MovieCard;
