const form = document.querySelector("#weatherForm");
const citySelect = document.querySelector("#citySelect");
const statusElement = document.querySelector("#weatherStatus");
const resultElement = document.querySelector("#weatherResult");

async function loadWeather() {
    const [latitude, longitude] = citySelect.value.split(",");
    const cityName = citySelect.options[citySelect.selectedIndex].text;

    statusElement.textContent = "Цаг агаар ачаалж байна...";
    resultElement.hidden = true;

    try {
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,wind_speed_10m&timezone=Asia%2FUlaanbaatar`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API алдаа: ${response.status}`);
        }

        const data = await response.json();

        document.querySelector("#weatherCity").textContent = cityName;
        document.querySelector("#temperature").textContent =
            data.current.temperature_2m;
        document.querySelector("#wind").textContent =
            data.current.wind_speed_10m;
        document.querySelector("#updatedAt").textContent =
            new Date(data.current.time).toLocaleString("mn-MN");

        statusElement.textContent = "";
        resultElement.hidden = false;
    } catch (error) {
        statusElement.textContent =
            "Цаг агаар ачаалж чадсангүй. Интернэт холболтоо шалгана уу.";
        console.error(error);
    }
}

form.addEventListener("submit", event => {
    event.preventDefault() ;
    loadWeather();
});