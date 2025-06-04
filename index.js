export default {
  async fetch(request) {
    // Parse query parameters from the URL
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const unit = url.searchParams.get('unit');

    // Validate query parameters
    if (!city || !unit) {
      return new Response(JSON.stringify({ error: "Missing required parameters: 'city' and 'unit'" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the weather API URL
    const weatherUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

    try {
      // Use native fetch
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();

      // Process the weather data
      const current = data.current_condition[0];
      const forecast = data.weather.slice(0, 3).map(day => ({
        date: day.date,
        avgtempC: day.avgtempC,
        avgtempF: day.avgtempF,
        hourly: day.hourly.map(hour => ({
          time: hour.time,
          tempC: hour.tempC,
          tempF: hour.tempF,
          weatherDesc: hour.weatherDesc[0].value,
        })),
      }));

      // Prepare the response
      const responseData = {
        location: data.nearest_area[0].areaName[0].value,
        country: data.nearest_area[0].country[0].value,
        current: {
          temperature: unit === 'f' ? `${current.temp_F}°F` : `${current.temp_C}°C`,
          condition: current.weatherDesc[0].value,
          humidity: `${current.humidity}%`,
          windSpeed: `${current.windspeedKmph} km/h`,
        },
        forecast,
      };

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch weather data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
