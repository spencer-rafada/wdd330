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
    console.log(this.films);
    this.outputElement.style.display = "initial";
    this.loadingElement.style.direction = "none";
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
      console.log(e.target);
      // TODO
    });
  }

  async filmSelected(filmTitle) {
    try {
      const film = this.films.find((item) => {
        item.title === filmTitle;
        if (!film) {
          throw new Error("Film not found");
        }
        this.outputElement.innerHTML = this.pageTemplate();
        this.outputElement.querySelector(".film-name").innerHTML = film.title;
        this.outputElement.querySelector(".crawl").innerText =
          film.opening_crawl;
      });
    } catch (err) {
      console.log(err);
    }
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
    </section>`;
  }
}
