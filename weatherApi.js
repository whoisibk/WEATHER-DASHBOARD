const apiKey = "41fad815a12711def87e9d275e436358";

export async function getCoordinates(city) {
  if (!city) {
    alert("No city provided");
    return null;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch coordinates");

    const data = await res.json();
    console.log("Geo API response:", data); // ✅ see exactly what you got
    console.log("Length:", data.length)
console.log("City value being sent:", city);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("City not found");
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    alert(error.message);
    return null;
  }
}


export async function getWeather(lat, lon) {
    if(!lat || !lon) {
        console.warn("No coordinates provided");
        return;

    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error("failed to fetch weather");
        const data = await res.json();
        return data;
    } 
    catch(error) {
        alert(error.message);
    }
}





export async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error("failed to fetch forecast");

    const data = await res.json();
    return data;
  }
  catch(error) {
    alert(error.message);
  }
}



