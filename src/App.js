import React from "react";
//Style
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
//UI Components
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
//Tools
import dayjs from "dayjs";
import authur from "../src/jevy.jpg";
//Child Component
import WeatherDetail from "./components/WeatherDetail";
//api
import * as weatherAPI from "./API";

const useStyles = makeStyles(() => ({
  root: {
    // maxWidth: 345,
    marginTop: 30,
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function App() {
  const classes = useStyles();
  // define the searched or selected target location
  const [seletedLocation, setSeletedLocation] = React.useState({
    title: "No city can be found",
    woeid: 0,
  });
  // define the search input value
  const [inputLocation, setInputLocation] = React.useState("");
  // error input status flag
  const [errorInput, setErrorInput] = React.useState(false);
  // locations that given by API for users to select
  const [locationList, setLocationList] = React.useState({
    title: "No city can be found",
    woeid: 0,
  });

  // define function to ask users' location access consent.
  const askLocConsent = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocCoords);
    } else {
      console.log("None Coords Found");
    }
  };

  // the call back function for getting the locations via API after the returning of users' coordinates
  const getLocCoords = async (locationInfo) => {
    let response = await weatherAPI.getLocationByCoords(
      locationInfo.coords.latitude,
      locationInfo.coords.longitude
    );

    await setLocationList(response);
  };

  // function for set the user selected location from location list
  const handleSelectLocation = async (event) => {
    setSeletedLocation({
      woeid: event.target.value,
      title: locationList.filter((x) => x.woeid === event.target.value)[0]
        .title,
    });
    setInputLocation("");
  };

  // handle the input from users search action
  const handleInput = async (event) => {
    setInputLocation(event.target.value);
  };

  // on submit search button, error monitors apply
  const onSearch = async () => {
    if (inputLocation !== "") {
      let searchedLoc = await weatherAPI.getLocationBySearch(inputLocation);
      if (searchedLoc.length !== 0) {
        setSeletedLocation({
          woeid: searchedLoc[0].woeid,
          title: searchedLoc[0].title,
        });
        setErrorInput(false);
      } else {
        setErrorInput(true);
      }
    } else {
      setErrorInput(true);
    }
  };

  return (
    <Grid container justify="space-around" className={classes.root} spacing={2}>
      <Grid item xs={10} md={4}>
        <Card>
          {/* Search card header */}
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                src={authur}
                className={classes.avatar}
              >
                J
              </Avatar>
            }
            action={<IconButton aria-label="settings"></IconButton>}
            title="Jevy's Weather Information Project"
            subheader={dayjs().format("DD/MMMM/YYYY")}
          />

          {/* Search input & Submit Button */}
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Please input your location:
            </Typography>
            <TextField
              value={inputLocation}
              name="inputLocation"
              onChange={handleInput}
              error={errorInput === true ? true : false}
              helperText={
                errorInput === true
                  ? "The input value is invalid, please try again."
                  : false
              }
            ></TextField>
            <Button color="primary" onClick={onSearch}>
              {" "}
              Search{" "}
            </Button>
          </CardContent>

          {/* Asking location access consent & select location */}
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Alternatively, you can just share your location via
            </Typography>
            <Button color="secondary" onClick={askLocConsent}>
              {" "}
              Click Me
            </Button>
          </CardContent>
          {/* Location list will show up after valid value set */}
          {locationList.length > 1 ? (
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                There are many cities around you, please help us to determin
                where are you.
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={seletedLocation.woeid}
                name="seletedLocation"
                onChange={handleSelectLocation}
                select
              >
                {locationList.map((option) => (
                  <MenuItem key={option.woeid} value={option.woeid}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          ) : null}
        </Card>
      </Grid>

      {/* Weather Detail Card, will show up after target location confirmed */}
      <Grid item xs={10} md={7}>
        {seletedLocation.woeid !== 0 ? (
          <WeatherDetail
            selectedWoeid={seletedLocation.woeid}
            selectedLocation={seletedLocation.title}
          />
        ) : null}
      </Grid>
    </Grid>
  );
}
