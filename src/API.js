import axios from "axios";

//get locations by current Lat & Lon
export const getLocationByCoords = async (lat, lon) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/location/search/?lattlong=${lat},${lon}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data);
          console.log("getLocation API", response);
        } else {
          reject(response.response);
        }
      })
      .catch(reject);
  });
};

export const getLocationBySearch = async (value) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/location/search/?query=${value}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data);
          console.log("getLocation API", response);
        } else {
          reject(response.response);
        }
      })
      .catch(reject);
  });
};

export const getWeather = async (woeid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/location/${woeid}/`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data);
          console.log("getWeather API", response);
        } else {
          reject(response.response);
        }
      })
      .catch(reject);
  });
};

export const getWeatherByDay = async (woeid, day) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/location/${woeid}/${day}/`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data);
          console.log("getWeather API", response);
        } else {
          reject(response.response);
        }
      })
      .catch(reject);
  });
};
