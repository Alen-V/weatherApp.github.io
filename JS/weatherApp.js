let $myDiv = document.getElementById('myDiv')
let pages = document.getElementsByClassName("page");
let myInput = document.getElementById(`myInput`);
let mySearchBtn = document.getElementById(`myBtn`);
let myNav = document.getElementsByClassName(`nav-item`)
let firstPage = document.getElementById(`firstPageContainer`)
firstPage.style.textAlign = `left`
let myTable = document.getElementById(`container`);
let mySortTable = document.getElementById(`containerData`)
let myHotBtn = document.getElementsByClassName(`hottest`);
let myColdBtn = document.getElementsByClassName(`coldest`);
let myGif = document.getElementById(`image`);
let dataMessage = document.getElementsByClassName(`fixed-bottom`)[0];
dataMessage.style.bottom = `100px`
dataMessage.style.display = `none`
let searchBox = document.getElementById(`formContainer`)
let navImage = document.getElementById(`bgImage`)
let dataResultButton = document.getElementById(`dataResultButton`)
let dropDown = []
let dropDownData = {}
let dropDownBtn = {}
let currentData = {};
let sunData = {}
let timeZoneData = {}
let airQualityData = {}
let humidityArr = [];
let tempArr = [];
let averageTemp = 0;
let lastItem = 0;
let firstItem = 0;
let date = new Date();

function hidePages(pages){
    for (let page of pages) {
       page.style.display = "none";
    }
}

function showPage(page){
    page.style.display = "block";
}

function activePage(pages, myPage){
    for (let page of pages){
        page.classList.remove(`active`)
    }
    myPage.classList.add(`active`)
}

function btnSelector(number, showSearch, show$Block, height){
    myNav[number].addEventListener('click', function(){
        hidePages(pages);
        showPage(pages[number]);
        activePage(myNav, myNav[number])
        searchBox.style.display = `${showSearch}`
        navImage.style.backgroundImage = `${show$Block}`;
        navImage.style.minHeight = `${height}`
    })
}

btnSelector(0, `block`, `url("../WeatherAppJS/Img/sunSetCloudy.jpg")`, `390px`)
btnSelector(1, `none`, `none`, `90px`)
btnSelector(2, `none`, `none`, `90px`)
btnSelector(3, `none`, `none`, `90px`)

showPage(pages[0]);
activePage(myNav, myNav[0]);

function getArrow(arrow, buttonArray){
    for (const button of buttonArray) {
        button.innerHTML = `${arrow}`
    }
}
getArrow(`&#x2BC6`, myHotBtn)
getArrow(`&#x2BC5`, myColdBtn)

let ascendingArray =[function(a, b){return b.main.temp-a.main.temp;}, 
    function(a, b){return b.main.humidity-a.main.humidity;}, 
    function(a, b){return b.wind.speed-a.wind.speed;}
]

let descendingArray = [function(a, b){return a.main.temp-b.main.temp;},
    function(a, b){return a.main.humidity-b.main.humidity;},
     function(a, b){return a.wind.speed-b.wind.speed;}
]

function getAverage(average, averageArr, first, second){
    for (let i = first; i < second; i++) {
        average += averageArr[i]
    }
    average = average / 5
    return average
}

function setToUpperCase(item){
    return item.charAt(0).toUpperCase() + item.slice(1)
}

function getHour(hours){
    for (let hour of hours) {
        hourDescription = setToUpperCase(hour.weather[0].description)
        temperature = hour.main.temp
        humidity = hour.main.humidity
        windSpeed = hour.wind.speed
        hourDate = hour.dt_txt
        let rainyHour = 0;
        if(hour.rain === undefined){
            rainyHour = 0.0
        } else {
            rainyHour = hour.rain[`3h`]
        }
        myTable.innerHTML += `
            <div id = "dropDown" class="row rowContainer">
                <div class="col-md-2">${hourDate.slice(11,16)}<br><span>${hourDate.slice(5,7)}/${hourDate.slice(8,10)}<span></div>
                <div class="col-md-1"><img src="http://openweathermap.org/img/w/${hour.weather[0].icon}.png" alt="logo"></div>
                <div class="col-md-7 tempLeft ">${Math.round(temperature)} °C</div>
                <div class= "col-md-2 dropDownBtn">&#x2BC6</div>
            </div>

            <div id = "dropDownData" class = "dropDownData">
                <div id = "dropDownLeft" class = "">
                    <div>Real Feel: ${Math.round(hour.main.feels_like)}</div>
                    <div>High/Low: ${Math.round(hour.main.temp_max)} / ${Math.floor(hour.main.temp_min)}</div>
                    <div>Wind Speed: ${windSpeed}m/sec</div>
                    <div>Humidity: ${humidity}%</div>
                </div>
                <div id = "dropDownRight" class = "">
                    <div>Cloud coverage: ${hour.clouds.all}</div>
                    <div>Rain: ${rainyHour} mm</div>
                </div>
            </div>
        `
        mySortTable.innerHTML += `
        <div class="row">
            <div class="col-md-2"><img src="http://openweathermap.org/img/w/${hour.weather[0].icon}.png" alt="logo"></div>
            <div class="col-md-2">${hour.weather[0].description}</div>
            <div class="col-md-2">${hourDate}</div>
            <div class="col-md-2" class = "temp">${temperature}</div>
            <div class="col-md-2" class = "humidity">${humidity}</div>
            <div class="col-md-2" class = "wind">${windSpeed}</div>
        </div>
        `
        tempArr.push(temperature)
        humidityArr.push(humidity)
    }
}

function sortArray(array){
    array.sort(function(a, b){
        return b - a
    })
}

function dates(dates, whichDate){
    return `${dates.getDate() + whichDate}/0${dates.getMonth() + 1}`
}

let sunrise = "";
function mainPage(data, sortArr){
    inputValue = myInput.value
    sortArray(humidityArr)
    sortedArray = [...data]
    sortedArray.sort(sortArr)
    firstItem = sortedArray[0]
    lastItem = sortedArray[sortedArray.length-1]
    let chartTempHot = firstItem.main.temp + 30
    let chartTempCold = lastItem.main.temp + 30
    let todayTemp = getAverage(averageTemp, tempArr, 0, 5)
    let tomorrowTemp = getAverage(averageTemp, tempArr, 5, 10)
    let chart = document.getElementsByClassName(`chart`)
    let chartBox = document.getElementsByClassName(`box`)
    let gmtTime = timeZoneData.gmtOffset / 3600
    let sunrise = sunData.sunrise.split("")
    let sunset = sunData.sunset.split("")

    firstPage.innerHTML = `
        <div class = "col-md-2 temp">
            Current weather 
            <br> ${dates(date, 0)} <br> 
            <img src="http://openweathermap.org/img/w/${data[0].weather[0].icon}.png" alt="logo"> 
            <br><span id = "tempSize">${Math.round(data[0].main.temp)}°C</span><br> 
            ${setToUpperCase(data[0].weather[0].description)}
            <br> Feels like ${Math.round(data[0].main.feels_like)}°C
        </div>

        <div class = "col-md-2 temp">
            Today 
            <br> ${dates(date, 1)} <br> 
            <img src="http://openweathermap.org/img/w/${data[3].weather[0].icon}.png" alt="logo"> 
            <br><span id = "tempSize">${Math.round(todayTemp)}°C</span><br> 
            ${setToUpperCase(data[3].weather[0].description)}
            <br> Feels like ${Math.round(data[3].main.feels_like)}°C
        </div>

        <div class = "col-md-2 temp">
            Tomorrow 
            <br> ${dates(date, 2)} <br> 
            <img src="http://openweathermap.org/img/w/${data[7].weather[0].icon}.png" alt="logo"> 
            <br><span id = "tempSize">${Math.round(tomorrowTemp)}°C</span><br> 
            ${setToUpperCase(data[7].weather[0].description)}
            <br> Feels like ${Math.round(data[7].main.feels_like)}°C
        </div>
        <div class = "col-md-1"></div>

        <div class = "col-md-2 chartContainer position">
            <div class = "weatherDescription">
                <p>Hottest day <br>${firstItem.dt_txt.slice(5, 10)}<br>${Math.round(firstItem.main.temp)}°C</p>
                <p>Coldest day <br>${lastItem.dt_txt.slice(5, 10)}<br>${Math.round(lastItem.main.temp)}°C</p>
                <div class = "chartBox">
                    <div class = "box"></div><p>Hot</p>
                </div>
                <div class = "chartBox">
                    <div class = "box"></div><p>Cold</p>    
                </div>
            </div>
            <div class = "chartBar">
                <div class = "chart"></div>
                <div class = "chart"></div>
            </div>
        </div>
        <div class = "col-md-3 sunData">
            <div><img src="./Img/sunrise.jpg" alt="logo"> Sunrise ${sunData.sunrise.replace(sunrise[0], Number(sunrise[0]) + gmtTime)}</div>
            <div><img src="./Img/sunset.jpg" alt="logo"> Sunset ${sunData.sunset.replace(sunset[0], Number(sunset[0]) + gmtTime)}</div>
            <div>The day is long ${sunData.day_length}</div>
            <div>pm10 = ${airQualityData.data.iaqi.pm10.v}</div>
            <div>pm2.5 = ${airQualityData.data.iaqi.pm25.v}</div>
        </div>
    `
    //Sunrise and Sunset data is not correct
    chart[0].style.height = `${chartTempHot}%`
    chart[1].style.height = `${chartTempCold}%`
    chart[1].style.backgroundColor = `blue`
    chartBox[0].style.backgroundColor = `red`
    chartBox[1].style.backgroundColor = `blue`
    if(inputValue !== ""){
        dataResultButton.innerText = `${cityData.name}, ${timeZoneData.countryName} ${Math.round(data[0].main.temp)}°C`
    } else {
        dataResultButton.innerText = `${cityData.name}, ${timeZoneData.countryName} ${Math.round(data[0].main.temp)}°C`
    }
}

function clearInput(input, secondInput){
    input.innerHTML = ``;
    if(secondInput === undefined){
        return
    }else{
        secondInput.innerHTML = ``
    }
}

function showDataResponse(data, text, color){
    data.innerHTML = `${text}`
    data.style.display = `block`;
    data.style.color = `${color}`
    data.style.fontSize = `40px`
}

function resetAnimation(element){
    element.classList.remove("fixed-bottom");
    void element.offsetWidth;
    element.classList.add("fixed-bottom");
}

function ascendingBtn(dataArr, sortFunction){
    clearInput(mySortTable)
    sortedArray = [...dataArr];
    sortedArray.sort(sortFunction)
    console.log(sortedArray)
    for (const data of sortedArray) {
        mySortTable.innerHTML += `
        <div class="row">
            <div class="col-md-2"><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="logo"></div>
            <div class="col-md-2">${setToUpperCase(data.weather[0].description)}</div>
            <div class="col-md-2">${data.dt_txt}</div>
            <div class="col-md-2" class = "temp">${data.main.temp}</div>
            <div class="col-md-2" class = "humidity">${data.main.humidity}</div>
            <div class="col-md-2" class = "wind">${data.wind.speed}</div>
        </div>
    `
}}

function clickButton(button, array){
    for (let i = 0; i < array.length; i++) {
        button[i].addEventListener(`click`, function(){
                ascendingBtn(currentData, array[i])
            })  
}}

async function getSun(city){
    myGif.innerHTML = `<img id="gif"src="../WeatherAppJS/Img/blueGif.gif" alt="logo"></img>`
    let gif = document.getElementById(`gif`)
    gif.style.height = `40px`
    gif.style.opacity = `0.5`
    mySearchBtn.style.display = `none`
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=814e138461b0f6b9423de687beb9ff3e`)
        let cityCall = await response.json()
        let sunUrl = `https://api.sunrise-sunset.org/json?lat=${cityCall.city.coord.lat}&lng=${cityCall.city.coord.lon}&date=today`
        await fetch(sunUrl)
        .then((response) => response.json())
        .then((documents) => {
                sunData = documents.results
            })
        let timeZoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=Z7SWLAUP9MHO&format=json&by=position&lat=${cityCall.city.coord.lat}&lng=${cityCall.city.coord.lon}
        `
        await fetch(timeZoneUrl)
            .then((response) => response.json())
            .then((documents) => {
                timeZoneData = documents
            })
        let airQualityUrl = `http://api.waqi.info/feed/skopje/?token=2a0b6013711cf98ff4cbd122fa7b446039e4e37f`
        await fetch(airQualityUrl)
            .then((response) => response.json())
            .then((documents) => {
                airQualityData = documents
            })
        responseList = cityCall.list
        cityData = cityCall.city
        currentData = responseList;
        getHour(responseList)
        mainPage(currentData, ascendingArray[0])
        showDataResponse(dataMessage, `We succesfully got our data`, `green`)
        clearInput(myInput, myGif)
        mySearchBtn.style.display = `block`
        resetAnimation(dataMessage)
        clickButton(myHotBtn, ascendingArray)
        clickButton(myColdBtn, descendingArray)
    } catch(err) {
        console.log(err)
            clearInput(myInput, myGif)
            mySearchBtn.style.display = `block`
            showDataResponse(dataMessage, `We didn't get our data`, `red`)
            resetAnimation(dataMessage)
    }
}
getSun(`skopje`)

mySearchBtn.addEventListener(`click`, function(e){
    e.preventDefault()
    getSun(myInput.value)
})