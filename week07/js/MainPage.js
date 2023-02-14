const baseUrl = "https://api.inaturalist.org/v1/";

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class MainPage {
  constructor(route) {
    this.route = route;
    this.data = [];
  }
  async init() {
    this.data = await this.getData();
    this.renderList(this.data);
  }

  getData = async () => {
    const result = await fetch(
      baseUrl + this.route + `?photos=true&sounds=true&native=true`
    );
    const data = await convertToJson(result);
    return data.results;
  };

  renderList = (data) => {
    const element = document.querySelector(`.iNaturalistContainer`);
    const html = data.map((item) => {
      console.log(item);
      return this.renderTemplate(item);
    });

    element.innerHTML = html.join("");
  };

  renderTemplate = (item) => {
    return `
    <div class="itemContainer">
    <img src="${item.photos[0].url}" alt="${item.species_guess}-img">
    <div>
    <a href="${item.uri}" target="_blank">
    <h1>${item.species_guess}</h1>
    </a>
    <a href="https://www.google.com/maps/search/${item.place_guess}" target="_blank">
    <h3>${item.place_guess}</h3>
    </a>
    <p>${item.description}</p>
    <audio controls>
    <source src="${item.sounds[0].file_url}">
    </audio>
    </div>
    </div>`;
  };
}
