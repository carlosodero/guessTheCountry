// DIV root
const rootDiv = document.getElementById('root');

// DIV container in root
const containerDiv = document.createElement('div');
containerDiv.id = 'containerDiv';
containerDiv.setAttribute('class','containerDiv');
rootDiv.appendChild(containerDiv);

// DIV top
const divTop = document.createElement('div');
divTop.id = 'divTop';
divTop.classList.add('divTop');
containerDiv.appendChild(divTop);

// DIV tittle
const divTittle = document.createElement('div');
divTittle.id = 'divTittle';
divTittle.classList.add('divTittle');
divTittle.innerText = 'Countries of the World';
containerDiv.appendChild(divTittle);

// DIV subtittle
const divSubTittle = document.createElement('div');
divSubTittle.id = 'divSubTittle';
divSubTittle.classList.add('divSubTittle');
divSubTittle.innerText = 'Can you name the countries of the world?';
containerDiv.appendChild(divSubTittle);

// DIV flag
const divFlags = document.createElement('div');
divFlags.id = 'divFlags';
divFlags.classList.add('divflags');
containerDiv.appendChild(divFlags);

// DIV check country
const divCheckCountry = document.createElement('div');
divCheckCountry.id = 'divCheckCountry';
divCheckCountry.classList.add('divCheckCountry');
divCheckCountry.innerText = 'This Flag is from';
containerDiv.appendChild(divCheckCountry);

// INPUT check country
const inputCheckCountry = document.createElement('input');
inputCheckCountry.id = 'inputCheckCountry';
inputCheckCountry.setAttribute('type', 'text');
inputCheckCountry.setAttribute('placeholder', 'Press ENTER to check your response');
inputCheckCountry.setAttribute('class', 'inputCheckCountry');
divCheckCountry.appendChild(inputCheckCountry);

// DIV check clues
const divCheckClues = document.createElement('div');
divCheckClues.id = 'divCheckClues';
divCheckClues.classList.add('divCheckClues');
containerDiv.appendChild(divCheckClues);

// DIV & BTTN clues
const btnClue = document.createElement('button');
btnClue.id = 'btnClue';
btnClue.textContent = '5 clues left!';
btnClue.setAttribute('class', 'btnClue');
divCheckClues.appendChild(btnClue);

const divClues = document.createElement('div');
divClues.id = 'divClues';
divClues.classList.add('divClues');
divCheckClues.appendChild(divClues);

// DIV result info
const divInfo = document.createElement('div');
divInfo.id = 'divInfo';
divInfo.classList.add('divInfo');

// DIV fail
const divFail = document.createElement('div');
divFail.id = 'divFail';
divFail.classList.add('divFail');
divFail.innerText = 'No! Try again!';


// async/await restcountries API
async function getCountries() {
  const response = await fetch('https://restcountries.com/v3.1/independent?status=true');
  const data = await response.json();
  console.log('countries', data);
  return data;
}

// async/await wikipedia API
async function getWikiPage(randomCountry) {
  const nameCountryEsp = randomCountry.translations.spa.common;
  const responseWiki = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=${nameCountryEsp}`);
  const dataWiki = await responseWiki.json();
  const pageIdWiki = dataWiki.query.search[0].pageid;
  // console.log(queryIDWiki);
  const urlWiki = `https://es.wikipedia.org/?curid=${pageIdWiki}`;
  // console.log('urlwiki', urlWiki);
  // return dataWiki;
  return urlWiki;
}

// main appFunction
async function appInit() {
  let countries;
  try {
    countries = await getCountries();
  } catch (error) {
    console.log('El error es: ', error);
  }
  const randomCountry = getRandomCountry(countries);
  paintFlag(randomCountry);
  generateClues(randomCountry);
  checkCountry(randomCountry);
}

// get randomNumber
function getRandomNumber(min, max) {
  const number = Math.floor(Math.random() * (max - min) + min);
  // console.log('number', number);
  return number;
}

// get randomCountry
function getRandomCountry(countries) {
  const min = 0;
  const max = countries.length;
  const randomNumber = getRandomNumber(min, max);
  const randomCountry = countries[randomNumber];
  return randomCountry;
}

// paint Flag
function paintFlag(randomCountry) {
  const imgFlag = document.createElement('img');
  imgFlag.id = 'imgFlag';
  imgFlag.setAttribute('class', 'imgFlag');
  imgFlag.setAttribute('src', `${randomCountry.flags.png}`);
  divFlags.appendChild(imgFlag);
}

// generate clues
function generateClues(randomCountry) {
  const clueOne = document.createElement('p');
  const clueTwo = document.createElement('p');
  const clueThree = document.createElement('p');
  const clueFour = document.createElement('p');
  const clueFive = document.createElement('p');

  clueOne.innerText = 'This country is located in ' + randomCountry.continents[0];
  clueTwo.innerText = `The main language of this country is ${Object.values(randomCountry.languages)[0]}`;
  clueThree.innerText = 'Usually, people drive on the ' + randomCountry.car.side + ' side';
  clueFour.innerText = 'Population is ' + randomCountry.population.toLocaleString('es-ES') + ' people';
  clueFive.innerText = 'The capital is ' + randomCountry.capital[0];

  let countClue = 1;
  function clickForClue() {
    switch (countClue) {
      case 1:
        divClues.appendChild(clueOne);
        countClue++;
        btnClue.textContent = '4 clues left!';
        break;
      case 2:
        divClues.appendChild(clueTwo);
        countClue++;
        btnClue.textContent = '3 clues left!';
        break;
      case 3:
        divClues.appendChild(clueThree);
        countClue++;
        btnClue.textContent = '2 clues left!';
        break;
      case 4:
        divClues.appendChild(clueFour);
        countClue++;
        btnClue.textContent = '1 clues left!';
        break;
      case 5:
        divClues.appendChild(clueFive);
        countClue++;
        btnClue.textContent = 'No clues left!';
        break;
    }
  }
  btnClue.addEventListener('click', clickForClue);
}

// check Country Field
function checkCountry(randomCountry) {
  inputCheckCountry.addEventListener('keydown', function(event) {
    const countryNameEsp = randomCountry.translations.spa.common.toLowerCase();
    const countryNameEspUc = randomCountry.translations.spa.common;
    if (event.code === 'Enter') {
      if (inputCheckCountry.value) {
        if (inputCheckCountry.value === countryNameEsp) {
          showCountryInfo(randomCountry);
          divInfo.innerText = `Yes it's ${countryNameEspUc}!`;
        } else {
          divFlags.appendChild(divFail);
          console.log('wowowowowooooo, try again', countryNameEsp);
        }
      } else {
        window.alert('Please enter a country');
      }
    }
  });
}

// show Info div
async function showCountryInfo(randomCountry) {
  // divInfo.innerText = `Yes ${randomCountry.translations.spa.common}! You hit it!`;
  const urlWikiLink = await getWikiPage(randomCountry);
  // console.log('urlWiki', urlWikiLink);

  // link Wikipedia
  const divWiki = document.createElement('div');
  divWiki.id = 'divWiki';
  divWiki.classList.add('divWikiMaps');
  divWiki.innerText = 'Learn more about this country on Wikipedia';
  divInfo.appendChild(divWiki);
  const aHrefWiki = document.createElement('a');
  aHrefWiki.setAttribute('href',urlWikiLink);
  aHrefWiki.setAttribute('target','_blank');
  const imgLogoWiki = document.createElement('img');
  imgLogoWiki.classList.add('imgWiki');
  imgLogoWiki.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wikipedia-logo-v2-es.svg/800px-Wikipedia-logo-v2-es.svg.png');
  divWiki.appendChild(aHrefWiki);
  aHrefWiki.appendChild(imgLogoWiki);

  // link Maps
  const divMaps = document.createElement('div');
  divMaps.id = 'divMaps';
  divMaps.classList.add('divWikiMaps');
  divMaps.innerText = 'Check where is this country on Gmaps';
  divInfo.appendChild(divMaps);
  const aHrefMaps = document.createElement('a');
  aHrefMaps.setAttribute('href',randomCountry.maps.googleMaps);
  aHrefMaps.setAttribute('target','_blank');
  const imgLogoMaps = document.createElement('img');
  imgLogoMaps.classList.add('imgMaps');
  imgLogoMaps.setAttribute('src', 'https://logodownload.org/wp-content/uploads/2018/01/google-maps-logo-0.png');
  divMaps.appendChild(aHrefMaps);
  aHrefMaps.appendChild(imgLogoMaps);

  containerDiv.appendChild(divInfo);
}

appInit();