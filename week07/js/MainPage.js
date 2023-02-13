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
    <h1>${item.species_guess}</h1>
    <h3>${item.place_guess}</h3>
    <a href="${item.uri}">Click Me</a>
    <img src="${item.photos[0].url}" alt="${item.species_guess}-img">
    <p>${item.description}</p>
    <audio controls>
      <source src="${item.sounds[0].file_url}">
    </audio>
    </div>`;
  };
}
