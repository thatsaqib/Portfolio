const button = document.getElementById('get-weather');

button.addEventListener('click', function () {
    const city = document.getElementById('input').value;
    console.log('User entered city:', city);

    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=9118541886c94a819aa81805250607&q=${city}&aqi=yes`

    if (city <= 0 ) {
        alert("City Not Found")
    }
    else{
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let temp = (data.current.temp_c + "°C");
            let result = document.getElementById('result');
            result.innerHTML = `The weather of ${city} is ${temp}`


        })
        .catch(error =>
            console.log(error.message));
    result.innerHTML = `${error.message}`
        }
})
