// ---------- GitHub Finder ----------
const ghBtn = document.getElementById('ghBtn');
const ghInput = document.getElementById('ghInput');
const ghResult = document.getElementById('ghResult');

async function fetchGitHubUser(username) {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
  try {
    ghResult.textContent = 'Loading...';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('User not found');
    }
    const data = await res.json();
    ghResult.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${data.avatar_url}" alt="${data.login}" class="w-12 h-12">
        <div>
          <div class="font-semibold">${data.name || data.login} (${data.login})</div>
          <div class="text-xs text-gray-600">${data.public_repos} public repos</div>
          <a href="${data.html_url}" target="_blank" class="text-xs text-indigo-600">View on GitHub</a>
        </div>
      </div>
    `;
  } catch (err) {
    ghResult.textContent = 'Error: ' + err.message;
  }
}

ghBtn.addEventListener('click', () => {
  const user = ghInput.value.trim();
  if (!user) {
    ghResult.textContent = 'Enter a username';
    return;
  }
  fetchGitHubUser(user);
});

ghInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') ghBtn.click();
});


// ---------- Weather (OpenWeather) ----------
const weatherBtn = document.getElementById('weatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const clearWeather = document.getElementById('clearWeather');
const apiKeyInput = '45c19ae4c589eccb2713f3537d77f31a';


async function fetchWeather(city, apiKey) {
  if (!city) {
    weatherResult.textContent = 'Enter a city name';
    return;
  }
  if (!apiKey) {
    weatherResult.textContent = 'Enter your OpenWeather API key';
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}&units=metric`;

  try {
    weatherResult.textContent = 'Loading...';
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found (404)');
      if (res.status === 401) throw new Error('Invalid API key (401)');
      throw new Error('Weather fetch error: ' + res.status);
    }
    const data = await res.json();
    const name = data.name;
    const temp = data.main?.temp;
    const desc = data.weather?.[0]?.description || '';
    weatherResult.innerHTML = `
      <div class="font-semibold">${name}</div>
      <div class="text-sm">Temperature: ${temp} °C</div>
      <div class="text-sm capitalize">Conditions: ${desc}</div>
    `;
  } catch (err) {
    weatherResult.textContent = 'Error: ' + err.message;
  }
}

weatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  const key = apiKeyInput.value.trim();
  fetchWeather(city, key);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') weatherBtn.click();
});

clearWeather.addEventListener('click', () => {
  cityInput.value = '';
  weatherResult.textContent = '';
});
