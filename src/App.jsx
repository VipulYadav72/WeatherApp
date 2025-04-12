import { useState, useEffect } from 'react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    const url = `https://open-weather13.p.rapidapi.com/city/${encodeURIComponent(city)}/IN`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '1f2ef36e97mshef65cb56de63ca3p1e6189jsn60235ffa17e3',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message || 'Error fetching weather data');
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  // Convert Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => {
    return Math.round((kelvin - 32)*5/9);
  };

  // Format date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-800">India Weather App</h1>
        
        <div className="flex">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name (India)"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={fetchWeather}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {weather && !error && (
          <div className="bg-blue-50 rounded-lg p-5 text-center">
            <div className="text-lg text-gray-600">{formatDate()}</div>
            <h2 className="text-3xl font-bold mt-2">{weather.name}</h2>
            
            <div className="flex justify-center items-center my-4">
              {weather.weather && weather.weather[0] && (
                <img 
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                  className="w-20 h-20"
                />
              )}
              
              {weather.main && (
                <div className="text-5xl font-bold ml-4">
                  {kelvinToCelsius(weather.main.temp)}°C
                </div>
              )}
            </div>
            
            {weather.weather && weather.weather[0] && (
              <div className="text-xl capitalize">
                {weather.weather[0].description}
              </div>
            )}
            
            {weather.main && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="text-gray-500">Feels Like</div>
                  <div className="text-xl font-semibold">
                    {kelvinToCelsius(weather.main.feels_like)}°C
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="text-gray-500">Humidity</div>
                  <div className="text-xl font-semibold">
                    {weather.main.humidity}%
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="text-gray-500">Wind Speed</div>
                  <div className="text-xl font-semibold">
                    {weather.wind ? `${weather.wind.speed} m/s` : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="text-gray-500">Pressure</div>
                  <div className="text-xl font-semibold">
                    {weather.main.pressure} hPa
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!weather && !error && !loading && (
          <div className="text-center p-6 text-gray-500">
            Search for a city in India to get weather information
          </div>
        )}
        
        <div className="text-center text-xs text-gray-500 mt-4">
          Powered by OpenWeather API
        </div>
      </div>
    </div>
  );
}