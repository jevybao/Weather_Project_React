import React, { useEffect } from "react";
// Style
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
// UI components
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
// API & Tool
import * as weatherAPI from "./../API";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

// const detail panel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// define the component proptypes
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.any.isRequired,
};

WeatherDetail.propTypes = {
  selectedWoeid: PropTypes.number.isRequired,
  selectedLocation: PropTypes.string.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
export default function WeatherDetail(props) {
  // define the props from APP, parent component
  const { selectedWoeid, selectedLocation } = props;

  const classes = useStyles();

  //define the selected panel value via index, 0 means today.
  const [value, setValue] = React.useState(0);

  //define the major data state
  const [days, setDays] = React.useState([]);

  //define the header information state
  const [headerInfo, setHeaderInfo] = React.useState({
    location: "",
    day: "",
    weather_icon: "",
    weather_description: "",
  });

  // define the function for initiating the data of this child components
  const initDays = async () => {
    // get source data from API, for the default day, "today".
    let response = await weatherAPI.getWeatherByDay(
      selectedWoeid,
      dayjs().format("YYYY/MM/DD") // for "today"
    );

    // const the major data state tamplate by using the first day, "today" 's data.
    let allDays = [];
    for (let i = 0; i < 5; i++) {
      allDays.push({
        index: i,
        day: dayjs().add(i, "day").format("YYYY/MM/DD"),
        label: dayjs().add(i, "day").format("DD MMM YY, ddd"),
        location: selectedLocation,
        woeid: selectedWoeid,
        weather_icon:
          `https://www.metaweather.com/static/img/weather/png/` +
          response[0].weather_state_abbr +
          `.png`,
        weather_max: response[0].max_temp,
        weather_min: response[0].min_temp,
        weather_windspeed: response[0].wind_speed,
        weather_description: response[0].weather_state_name,
        gotInfo: false,
      });
    }
    // describe the first day, today has been updated via API.
    allDays[0].gotInfo = true;

    setDays(allDays);

    // set initial header information
    setHeaderInfo({
      location: selectedLocation,
      day: dayjs(response[0].applicable_date).format("DD MMM YY, dddd"),
      weather_icon:
        `https://www.metaweather.com/static/img/weather/png/` +
        response[0].weather_state_abbr +
        `.png`,
      weather_description: response[0].weather_state_name,
    });
  };

  // handle day selected change.
  const handleChange = async (event, newValue) => {
    // the condition for checking if the selected day has been updated,
    // if not updated, get via api, if updated, just go through.
    if (days.filter((x) => x.index === newValue).gotInfo !== true) {
      let newDay = days.filter((x) => x.index === newValue)[0].day;
      let response = await weatherAPI.getWeatherByDay(selectedWoeid, newDay);
      setDays(
        days.map((item) =>
          item.index === newValue
            ? {
                ...item,
                weather_icon:
                  `https://www.metaweather.com/static/img/weather/png/` +
                  response[0].weather_state_abbr +
                  `.png`,
                weather_max: response[0].max_temp,
                weather_min: response[0].min_temp,
                weather_windspeed: response[0].wind_speed,
                weather_description: response[0].weather_state_name,
                gotInfo: true,
              }
            : item
        )
      );
      setHeaderInfo({
        ...headerInfo,
        day: dayjs(newDay).format("DD MMM YY, dddd"),
        weather_icon:
          `https://www.metaweather.com/static/img/weather/png/` +
          response[0].weather_state_abbr +
          `.png`,
        weather_description: response[0].weather_state_name,
      });
    } else {
      setHeaderInfo(
        days.map((item) =>
          item.index === newValue
            ? {
                ...headerInfo,
                day: dayjs(item.day).format("DD MMM YY, dddd"),
                weather_icon: item.weather_icon,
                weather_description: item.weather_description,
              }
            : item
        )
      );
    }
    setValue(newValue);
  };

  // hooks for the selected or searched location change
  useEffect(() => {
    setValue(0);
    initDays();
  }, [selectedWoeid]);

  return (
    <Card className={classes.root}>
      {/* detail card, header */}
      <CardHeader
        avatar={<Avatar variant="square" src={headerInfo.weather_icon} />}
        title={headerInfo.location + ", " + headerInfo.weather_description}
        subheader={headerInfo.day}
      />

      {/* Days Tab */}
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {days.map((x) => (
            <Tab
              label={x.label}
              key={x.index}
              index={x.index}
              {...a11yProps(x.index)}
            />
          ))}
        </Tabs>
      </AppBar>

      {/* Details panels */}
      {days.map((x) => (
        <TabPanel value={value} key={x.index} index={x.index}>
          The max temperature is: {x.weather_max.toFixed(2)} &#8451;
          <br />
          The min temperature is: {x.weather_min.toFixed(2)} &#8451;
          <br />
          The wind speed is: {x.weather_windspeed.toFixed(2)} KM/H
        </TabPanel>
      ))}
    </Card>
  );
}
