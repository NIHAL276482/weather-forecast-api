# 🌤️ Weather Forecast API

This lightweight Node.js (Next.js) API endpoint fetches current and 3-day weather forecasts for a given city using the [wttr.in](https://wttr.in) service. It's ideal for apps, bots, dashboards, or personal projects needing real-time weather updates!

## 🚀 Features

- 📍 Retrieves real-time weather and forecasts for any city.
- 🌡️ Supports both Celsius and Fahrenheit.
- 📦 Simple API built with async/await.
- 🔧 Easily integratable with frontends, bots, or serverless functions.

## 🛠️ Requirements

- Node.js v14 or higher.
- A Next.js server or any backend supporting API routes (e.g., Vercel, Netlify functions).

## 📡 Usage

1. **Setup**:
   - Create a file under `pages/api/weather.js` in your Next.js project.
   - Paste the following code:

     ```js
     import fetch from 'node-fetch';

     export default async function handler(req, res) {
       const { city, unit } = req.query;

       if (!city || !unit) {
         return res.status(400).json({ error: "Missing required parameters: 'city' and 'unit'" });
       }

       const url = \`https://wttr.in/\${encodeURIComponent(city)}?format=j1\`;

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
     ```

2. **Run Your Server**:
   ```bash
   npm run dev
   ```

3. **Access the API**:
   - Visit: `http://localhost:3000/api/weather?city=London&unit=c`
   - You’ll receive a response like:

   ```json
   {
     "location": "London",
     "country": "United Kingdom",
     "current": {
       "temperature": "18°C",
       "condition": "Partly cloudy",
       "humidity": "67%",
       "windSpeed": "13 km/h"
     },
     "forecast": [...]
   }
   ```

## ⚠️ Error Handling

- Returns `400` if `city` or `unit` is missing.
- Returns `500` if the weather service fails to respond.

## 📝 License

This project is licensed under the License – see the [LICENSE](https://github.com/NotFlexCoder/NotFlexCoder/blob/main/LICENSE) file for details.
