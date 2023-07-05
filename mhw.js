const dataListElement = document.getElementById('dataList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterSelect = document.getElementById('filterSelect');
const scrollButton = document.getElementById('scrollButton');

let data = [];
let filteredData = [];

const apiEndpoints = [
  'https://mhw-db.com/ailments',
  'https://mhw-db.com/monsters',
  'https://mhw-db.com/weapons',
  'https://mhw-db.com/armor/sets'
];

Promise.all(apiEndpoints.map(endpoint => fetch(endpoint)))
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(items => {
    data = items.flat();
    filteredData = data;
    renderData();
  })
  .catch(error => {
    console.log('Error:', error);
  });

searchButton.addEventListener('click', search);
searchInput.addEventListener('keyup', search);
filterSelect.addEventListener('change', filter);
scrollButton.addEventListener('click', scrollToTop);

function renderData() {
  dataListElement.innerHTML = '';

  filteredData.forEach(item => {
    const itemElement = createItemElement(item);
    dataListElement.appendChild(itemElement);
  });
}

function createItemElement(item) {
  const itemElement = document.createElement('div');
  itemElement.className = 'item';

  const nameElement = document.createElement('h3');
  nameElement.textContent = item.name;

  const detailsElement = document.createElement('p');
  detailsElement.textContent = getItemDetails(item);

  itemElement.appendChild(nameElement);
  itemElement.appendChild(detailsElement);

  return itemElement;
}

function getItemDetails(item) {
  if ('description' in item) {
    return item.description;
  } else if ('species' in item) {
    return `Species: ${item.species}`;
  } else if ('type' in item) {
    return `Type: ${item.type}`;
  } else if ('rank' in item) {
    return `Rank: ${item.rank}`;
  }
}

function search() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredData = data.filter(item => item.name.toLowerCase().includes(searchTerm));
  renderData();
}

function filter() {
  const filterValue = filterSelect.value;
  if (filterValue === '') {
    filteredData = data;
  } else if (filterValue === 'ailments') {
    filteredData = data.filter(item => 'description' in item);
  } else if (filterValue === 'monsters') {
    filteredData = data.filter(item => 'species' in item);
  } else if (filterValue === 'weapons') {
    filteredData = data.filter(item => 'type' in item);
  } else if (filterValue === 'armor') {
    filteredData = data.filter(item => 'rank' in item);
  }
  renderData();
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ... El resto de tu código ... */

window.addEventListener('scroll', toggleScrollButton);

function toggleScrollButton() {
  if (window.pageYOffset > 0) {
    scrollButton.classList.add('active');
  } else {
    scrollButton.classList.remove('active');
  }
}

