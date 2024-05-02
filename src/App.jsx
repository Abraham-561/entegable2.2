import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setTimeout(() => {
        setShowMessage(true)
    },3000);
    const success = (pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    };

    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => {
    if (coords) {
      const API_KEY = "fea0f957067ffc34e47d1b632fa5c75a";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&q=${inputValue}`;
      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [coords , inputValue]);


    const inputSearch = useRef()


  const handletSubmit = e => {
    e.preventDefault()
    
    setInputValue(inputSearch.current.value);
  }

  return (
    <div className="app">
      <div>
        <form className="form"  onSubmit={handletSubmit}>
          <input className="input" ref={inputSearch} name="inputWheather" type="text"/>
          <button className="btn">Search</button>
        </form>
      </div>
      <div>

        {isLoading ? (
        <div>
          <h1 style={{ color: "white" }}>Loading...</h1>
          {
            showMessage && <p style={{ color: "white" }}>Por favor, activa la ubicacion</p>
          }
          
        </div>
      ) : hasError ? (
         <h1 style={{ color: "white" }}>Para optener el clima de tu ubicacion activa la ubicacion  </h1>
      ) : (
        <WeatherCard 
        weather={weather}
         temp={temp} />
      )}
      </div>
      
    </div>
  );
}

export default App;
