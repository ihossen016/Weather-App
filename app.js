const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoText = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let apiKey = "4ea0d80c28a405a29209a34851d7f525";

inputField.addEventListener("keyup", e => {
  //   If user press Enter and input field is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser doesn't support Geolocation");
  }
});

const onSuccess = position => {
  const { latitude, longitude } = position.coords;
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData(api);
};

const onError = error => {
  infoText.innerText = error.message;
  infoText.classList.add("error");
};

const requestApi = city => {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData(api);
};

const fetchData = api => {
  infoText.innerText = "Getting Weather Details...";
  infoText.classList.add("pending");

  //  Getting API response and sending it to weatherDetails function
  fetch(api)
    .then(response => response.json())
    .then(result => weatherDetails(result));
};

const weatherDetails = info => {
  if (info.cod == "404") {
    infoText.innerText = `${inputField.value} isn't a valid city name.`;
    infoText.classList.replace("pending", "error");
  } else {
    // Collecting Specific values
    const cityName = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // Changing img according to id
    if (id == 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "icons/rain.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    }

    // Passing these values to HTML elements
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(
      ".location span"
    ).innerText = `${cityName}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
};

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});
