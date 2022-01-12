import React, {useState, useEffect } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  upcomingMoviesHeading: {
    textAlign: 'center',
    background: '#ff9999',
    padding: '8px',
    marginTp:'8px',
    fontSize: '1rem'
  },  
  gridListUpcomingMovies: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    width: '100%'
  },
  gridListMain: {

    transform: 'translateZ(0)',
    cursor: 'pointer'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
  },
  title: {
    color: theme.palette.primary.light,
  }
});

const Home = (props) => {
  const [movieName, setMovieName] = useState("");
  const [upcomingMovies, setUpcomingMovies] = useState([{}]);
  const [releasedMovies, setReleasedMovies] = useState([{}]);
  const [genresList, setGenresList] = useState([{}]);
  const [artistsList, setArtistsList] = useState([{}]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");



  useEffect(()=> {

    //list of upcoming movies
    let dataUpcoming = null;
    fetch(props.baseUrl + "movies?status=PUBLISHED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: dataUpcoming,
    })
      .then((response) => response.json())
      .then((response) => {
        setUpcomingMovies(response.movies);
      });

    //list of released movies
    let dataReleased = null;
    fetch(props.baseUrl + "movies?status=RELEASED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: dataReleased,
    })
      .then((response) => response.json())
      .then((response) => {
        setReleasedMovies(response.movies);
      });

    //list of genres
    let dataGenres = null;
    fetch(props.baseUrl + "genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: dataGenres,
    })
      .then((response) => response.json())
      .then((response) => {
        setGenresList(response.genres);
      });

      //list of artists
    let dataArtists = null;
    fetch(props.baseUrl + "artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: dataArtists,
    })
      .then((response) => response.json())
      .then((response) => {
        setArtistsList(response.artists);
      });
  }, []);

  const movieNameChangeHandler = event => {
    setMovieName(event.target.value);

  }

  const genreSelectHandler = event => {
    setGenres(event.target.value);
  }

  const artistsSelectHandler = event => {
    setArtists(event.target.value);
  }

  const releaseDateStartHandler = event => {
    setReleaseDateStart(event.target.value);
  }

  const releaseDateEndHandler = event => {
    setReleaseDateEnd(event.target.value);
  }

  const movieClickHandler = (movieId) => {
    props.history.push('/movie/' + movieId);


  }

  const filterApplyHandler = () => {

    let queryString = "?status=RELEASED";
    if (movieName !== "") {
      queryString += "&title=" + movieName;
    }
    if ({genres}.length > 0) {
      queryString += "&genres=" + genres.toString();
    }
    if (artists.length > 0) {
      queryString += "&artist_name=" + artists.toString();
    }
    if (releaseDateStart !== "") {
      queryString += "&start_date=" + releaseDateStart
    }
    if (releaseDateEnd !== "") {
      queryString += "&end_date=" + releaseDateEnd
    }

   
    let dataFilter = null;
    let xhrFilter = new XMLHttpRequest();
    xhrFilter.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        setReleasedMovies(JSON.parse(this.responseText).movies);
      }
    })

    xhrFilter.open("GET", props.baseUrl + "movies" + encodeURI(queryString));
    xhrFilter.setRequestHeader("Cache-Control", "no-cache");
    xhrFilter.send(dataFilter);


  }

    const { classes } = props;
    return (
      <div>
        <Header baseUrl={props.baseUrl} />
        <div className={classes.upcomingMoviesHeading}>
          <span> Upcoming Movies </span>
        </div>
        <GridList cellHeight={250} cols={6} className={classes.gridListUpcomingMovies}>
          {upcomingMovies.map(movie => (
            <GridListTile className={classes.movieTile} key={"upcoming" + movie.id}>
              <img src={movie.poster_url} alt={movie.title} />
              <GridListTileBar title={movie.title} />
            </GridListTile>
          ))}
        </GridList>
        <div className="flex-container">
          <div className="left">
            <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
              {releasedMovies.map(movie => (
                <GridListTile onClick={() => movieClickHandler(movie.id)} className="marginMovie" key={"grid" + movie.id}>
                  <img src={movie.poster_url} alt={movie.title} />
                  <GridListTileBar
                    title={movie.title}
                    subtitle={<span>Release Date: {new Date(movie.release_date).toDateString()}</span>}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
          <div className="right">
            <Card>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <Typography className={classes.title} color="textSecondary">
                    FIND MOVIES BY:
                  </Typography>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="movieName"> Movie Name </InputLabel>
                  <Input id="movieName" onChange={movieNameChangeHandler} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox"> Genre</InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(',')}
                    value={genres}
                    onChange={genreSelectHandler}>
                    <MenuItem value="0">None
                   </MenuItem>
                    {genresList.map(genre => (
                      <MenuItem key={"genre" + genre.id} value={genre.genre}>
                        <Checkbox checked={genres.indexOf(genre.genre) > - 1} />
                        <ListItemText primary={genre.genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox"> Artists</InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(',')}
                    value={artists}
                    onChange={artistsSelectHandler}>
                    <MenuItem value="0">None
                   </MenuItem>
                    {artistsList.map(artist => (
                      <MenuItem key={"artist" + artist.id} value={artist.first_name + " " + artist.last_name}>
                        <Checkbox checked={artists.indexOf(artist.first_name + " " + artist.last_name) > - 1} />
                        <ListItemText primary={artist.first_name + " " + artist.last_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateStart"
                    label="Release Date Start"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={releaseDateStartHandler}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateEnd"
                    label="Release Date End"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={releaseDateEndHandler}
                  />
                </FormControl><br /><br />
                <FormControl className={classes.formControl}>
                  <Button onClick={() => filterApplyHandler()} variant="contained" color="primary">
                    APPLY
                    </Button>
                </FormControl>

              </CardContent>
            </Card>

          </div>
        </div>
      </div>

    )
};

export default withStyles(styles)(Home);

