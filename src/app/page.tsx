'use client'
import axios from "axios";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from "react";
import { app } from "@/config/firebase";

const getCurrentDate = () => {
  const currentDate = new Date();
  const options = { month: 'long' };
  const monthName = currentDate.toLocaleDateString('en-Us', options);
  const date = new Date().getDate() + ',' + monthName;
  return date;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState(''); // State to store city name
  const date = getCurrentDate();
  const router = useRouter();
  const auth = getAuth(app);
  // Function to fetch weather data by city name

  async function fetchData(cityName: string) {
    try {
      const response = await axios.get("http://localhost:3000/api/weather?address=" + cityName);
      setWeatherData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // If location access not available or denied, fetch weather for Kerala
            fetchWeatherDataForCity("Kerala");
          }
        );
        // User is signed in, fetch weather data
      } else {
        setUser(null);
        router.push('/signin'); // Redirect to the sign-in page if the user is not signed in
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch weather data by latitude and longitude
  const fetchWeatherData = async (latitude: number | null, longitude: number | null) => {
    if (latitude !== null && longitude !== null) {
      try {
        const response = await axios.get(`http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`);
        setWeatherData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.error("Latitude or longitude is null. Cannot fetch weather data.");
    }
  };

  // Function to fetch weather data by city name
  const fetchWeatherDataForCity = async (cityName: string) => {
    if (cityName.trim() !== "") {
      try {
        const response = await axios.get("http://localhost:3000/api/weather?address=" + cityName);
        setWeatherData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.error("City name is empty. Cannot fetch weather data.");
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeatherDataForCity(city);
    } else {
      console.error("City name is empty. Cannot submit form.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
    <div className="absolute w-full flex justify-center top-14"><button className="bg-black p-2 text-white px-4 m-auto rounded-full" onClick={handleSignOut}>Sign Out</button></div>
    <div className="flex w-full justify-center bg-[#6455f0] h-screen items-center">
      {weatherData && (
        <div className="bg-gradient-to-b shadow-2xl shadow-gray-800 from-[#6472f1] flex flex-col items-center  to-[#8295db] p-4 rounded-lg h-72 w-64">
          <form className="" onSubmit={handleSubmit}>
            <div className="w-full flex space-x-2 mb-4">
              <input type="text" placeholder="search" value={city} className="w-36 rounded-full text-black p-1 bg-opacity-10 ring-offset-0 outline-none shadow-xl shadow-gray-800" onChange={(e) => setCity(e.target.value)} />
              <button className="bg-black p-1 rounded-full text-white bg-opacity-50 shadow-xl shadow-gray-900 hover:bg-black hover:bg-opacity-80 text-xs " type="submit">Get</button>
            </div>
          </form>
          <div className="flex flex-col justify-evenly h-full tracking-widest leading-10 text-xl font-medium">
            {weatherData.weather && weatherData.weather[0] ? (
              <>
                <div className="w-full flex ">
                  <div className="absolute left-[51.7%]  bottom-[51%]">
                    {weatherData.weather[0].description === "rain" || weatherData.weather[0].description === "fog" ? (
                      <i className={`wi wi-day-${weatherData.weather[0].description} text-4xl`}></i>
                    ) : (
                      <div className="relative">
                        <i className="wi wi-day-cloudy text-white "></i>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-center tracking-wider">
                    <p className="text-6xl text-opacity-90 text-black ">
                      {weatherData.main && weatherData.main.temp ? (Math.round(weatherData.main.temp - 273.5) + String.fromCharCode(176)) : ""}
                    </p>
                    <span>{weatherData.weather[0].description.toUpperCase()}</span>
                  </div>
                </div>
                <div className="w-full flex flex-col  justify-center items-center">
                  <h1 className="[text-shadow:1px_3px_3px_var(--tw-shadow-color)] shadow-blue-950  text-center text-2xl text-[#545aee] drop-shadow-xl font-bold">{weatherData.name}</h1>
                  <p className="text-center font-extralight">{date}</p>
                </div>
                <div className="flex w-full justify-between">

                  <div className="text-sm text-center flex justify-center items-center"> {weatherData.wind.deg}° <i className={`wi wi-wind-beaufort-${Math.round(weatherData.wind.speed)}`}></i></div>
                  <div className="text-sm text-center flex justify-center items-center">
                    <i className="wi wi-humidity"></i>{weatherData.main && weatherData.main.humidity}%
                  </div>
                  

                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
