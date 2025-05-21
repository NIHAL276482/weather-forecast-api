import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { city, unit } = req.query;

  if (!city || !unit) {
    return res.status(400).json({ error: "Missing required parameters: 'city' and 'unit'" });
  }

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const current = data.current_condition[0];
    const forecast = data.weather.slice(0, 3).map(day => ({
      date: day.date,
      avgtempC: day.avgtempC,
      avgtempF: day.avgtempF,
      hourly: day.hourly.map(hour => ({
        time: hour.time,
        tempC: hour.tempC,
        tempF: hour.tempF,
        weatherDesc: hour.weatherDesc[0].value
      }))
    }));

    res.status(200).json({
      location: data.nearest_area[0].areaName[0].value,
      country: data.nearest_area[0].country[0].value,
      current: {
        temperature: unit === 'f' ? current.temp_F + '°F' : current.temp_C + '°C',
        condition: current.weatherDesc[0].value,
        humidity: current.humidity + '%',
        windSpeed: current.windspeedKmph + ' km/h'
      },
      forecast
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
