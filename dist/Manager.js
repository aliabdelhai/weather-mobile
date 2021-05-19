class Manager {
    constructor() {
      this.cityData = [];
    }
  
    calcTimeDiff(lastUpdated) {
      let diff = moment().diff(moment(lastUpdated), 'minutes');
      diff = diff % 60;
      diff < 0 ? (diff = 60 + diff) : null;
      return diff;
    }
  
    async getDataFromDB() {
      let cities = await $.get('/cities');
      if (cities) {
        this.cityData = cities;
        await this.checkRefresh();
        cities = await $.get('/cities');
        this.cityData = cities;
      }
      return this.cityData;
    }
  
    // Get City Data & Save on DB
    async getCityData(cityName) {
      let weatherInfo = await $.get(`/city/${cityName}`);
      console.log(weatherInfo);
      weatherInfo = JSON.parse(weatherInfo.body);
      //   weatherInfo = weatherInfo.body;
  
      let isCityExist = this.cityData.some(
        (c) => c.name.toLowerCase() === weatherInfo.name.toLowerCase()
      );
      if (!isCityExist) {
        let lastUpdated = new Date(parseInt(weatherInfo.dt) * 1000);
        let diff = this.calcTimeDiff(lastUpdated);
        let lastRefreshed = moment().format();
        this.cityData.unshift({
          name: weatherInfo.name,
          temperature: Math.round(weatherInfo.main.temp - 273),
          condition: weatherInfo.weather[0].description,
          conditionIcon: `https://download.spinetix.com/content/widgets/icons/weather/${weatherInfo.weather[0].icon}.png`,
          lastUpdated,
          diff,
          lastRefreshed,
        });
        this.saveCity(weatherInfo.name);
      } else console.log(`${weatherInfo.name} (you typed "${cityName}") is already in the DB`);
    }
  
    saveCity(cityName) {
      let city = this.cityData.find((c) => c.name === cityName);
      $.ajax({
        type: 'POST',
        url: '/city',
        data: city,
        success: (response) => console.log(cityName + ' was added to DB'),
      });
    }
  
    removeCity(cityName) {
      $.ajax({
        type: 'DELETE',
        url: `/city/${cityName}`,
        success: (response) => console.log(response),
        error: (error) => console.log(error.statusText)
      });
    }
  
    async updateCity(cityName) {
      let weatherInfo = await $.get(`/city/${cityName}`);
      weatherInfo = JSON.parse(weatherInfo.body);
      let lastUpdated = new Date(parseInt(weatherInfo.dt) * 1000);
      let diff = this.calcTimeDiff(lastUpdated);
      let lastRefreshed = moment().format();
      let newWeather = {
        name: weatherInfo.name,
        temperature: Math.round(weatherInfo.main.temp - 273),
        condition: weatherInfo.weather[0].description,
        conditionIcon: `https://download.spinetix.com/content/widgets/icons/weather/${weatherInfo.weather[0].icon}.png`,
        lastUpdated,
        diff,
        lastRefreshed,
      };
      $.ajax({
        type: 'PUT',
        url: `/city`,
        data: newWeather,
        success: (response) => console.log(cityName + ' was updated'),
      });
    }
  
    // Check the time of last updated
    async checkRefresh() {
      let citiesToUpdate = this.cityData
        .filter((c) => moment().diff(moment(c.lastRefreshed), 'minutes') > 180)
        .map((c) => c.name);
      if (citiesToUpdate) {
        citiesToUpdate.forEach(async (c) => await this.updateCity(c));
      }
      return;
    }
  }