// Star Wars API
const baseUrl = "https://swapi.dev/api/";

export default class SwapiHelper {
  constructor(outputId, filmId, loadingId) {
    this.outputId = outputId;
    this.filmId = filmId;
    this.loadingId = loadingId;
    this.outputElement = document.getElementById(outputId);
    this.filmElement = document.getElementById(filmId);
    this.loadingElement = document.getElementById(loadingId);
    this.films = [];
    this.init();
  }

  async init() {
    this.outputElement.style.display = "none";
    this.loadingElement.style.display = "block";
    this.films = await this.makeRequest(baseUrl + "films");
    this.films = this.films.results;
    // console.log(this.films);
    this.outputElement.style.display = "initial";
    this.loadingElement.style.display = "none";
    this.clickableList(this.films, this.filmId, this.filmSelected.bind(this));
  }

  async makeRequest(baseUrl) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.text();
        throw new Error(error);
      }
      // This is a terrible way of dealing with errors
    } catch (error) {
      console.log(error);
    }
  }

  clickableList(list, elementId, callback) {
    const element = document.getElementById(elementId);
    element.innerHTML = list
      .map((film) => {
        return `<li>${film.title}</li>`;
      })
      .join("");
    element.addEventListener("click", (e) => {
      // console.log(e.target);
      this.setActive(element, e.target);
      callback(e.target.innerText);
    });
  }

  async filmSelected(filmTitle) {
    try {
      const film = this.films.find((item) => {
        return item.title === filmTitle;
      });
      // console.log(film);
      if (!film) {
        throw new Error("Film not found");
      }
      this.outputElement.innerHTML = this.pageTemplate();
      this.outputElement.querySelector(".film-name").innerHTML = film.title;
      this.outputElement.querySelector(".crawl").innerText = film.opening_crawl;
      const planets = await this.getListDetails(film.planets);
      // console.log(planets);
      this.renderList(planets, this.planetTemplate, ".film-planets");
      const starships = await this.getListDetails(film.starships);
      this.renderList(starships, this.starshipsTemplate, ".film-starships");
      const species = await this.getListDetails(film.species);
      this.renderList(species, this.speciesTemplate, ".film-species");
      console.log(species);
      // 0 is human
      const people = await this.getListDetails(species[0].people);
      this.renderList(people, this.peopleTemplate, ".film-people");
    } catch (err) {
      console.log(err);
      document.querySelector(".film-list").classList.remove("active");
    }
  }

  renderList(list, template, outputId) {
    const element = document.querySelector(outputId);
    element.innerHTML = "";
    const htmlString = list.map((item) => {
      return template(item);
    });
    element.innerHTML = htmlString.join("");
  }

  pageTemplate() {
    return `<h2 class="film-name"></h2>
    <p class="crawl"></p>
    <section class="planets">
      <h3>Planets</h3>
      <ul class="detail-list film-planets"></ul>
    </section>
    <section>
      <h3>Starships</h3>
      <ul class="detail-list film-starships"></ul>
    </section>
    <section>
      <h3>Species</h3>
      <ul class="detail-list film-species"></ul>
    </section>
    <section>
      <h3>People</h3>
      <ul class="detail-list film-people"></ul>
    </section>`;
  }

  setActive(parent, target) {
    // make children inactive
    const children = [...parent.childNodes];
    // console.log(children);
    children.forEach((node) => {
      node.classList.remove("active");
    });
    // Make the target active
    target.classList.add("active");
  }

  async getListDetails(list) {
    // console.log(list);
    const details = await Promise.all(
      list.map((url) => {
        // console.log(url);
        return this.makeRequest(url);
      })
    );
    return details;
  }

  planetTemplate(planet) {
    return `<li>
      <h4 class="planet-name">${planet.name}</h4>
      <p>Climate: ${planet.climate}</p>
      <p>Terrain: ${planet.terrain}</p>
      <p>Year: ${planet.orbital_period}</p>
      <p>Day: ${planet.rotation_period}</p>
      <p>Population: ${planet.population}</p>
    </li>`;
  }

  starshipsTemplate(starship) {
    return `<li>
      <h4 class="starship-name">${starship.name}</h4>
      <p>Model: ${starship.model}</p>
      <p>Manufacturer: ${starship.manufacturer}</p>
      <p>Cost: ${starship.cost_in_credits}</p>
      <p>Max Speed: ${starship.max_atmosphering_speed}</p>
    </li>`;
  }

  speciesTemplate(species) {
    return `<li>
      <h4 class="species-name">${species.name}</h4>
      <p>Classification: ${species.classification}</p>
    </li>`;
  }

  peopleTemplate(people) {
    return `<li>
      <h4 class="people-name">${people.name}</h4>
      <p>Height: ${people.height}</p>
      <p>Gender: ${people.gender}</p>
      <p>Birth Year: ${people.birth_year}</p>
    </li>`;
  }
}
