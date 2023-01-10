/*
When the page loads
    Get list of pokemon types.
    render type list out (need type name and url to get all pokemon of that type)
    attach a listener to respond to a click on the type.
        when clicked it should pull the type url and retrieve the data
        render the list of pokemon
        style the clicked type as active
        filter out types with no pokemon (shadow and unknown)
*/

// we have to convert the response fetch sends back into the appropriate type. In this case the API sends back json...so we process it as json and send it back
function convertToJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("bad response");
  }
}

// once we have the data, we need to do something with it. This won't always be the same thing though. With a callback (function passed into a function) we can change the behavior as needed.
async function getData(url, callback) {
  const data = await fetch(url);
  const json = await convertToJson(data);
  // console.log(json);
  if (callback) {
    callback(json);
  }
}

// keep things from happening until the DOM is ready
// another alternative would be to add 'defer' to our script element
window.addEventListener("load", () => {
  getData("https://pokeapi.co/api/v2/type", renderTypeList);

  document
    .getElementById("typeList")
    .addEventListener("click", typeClickedHandler);
});

// create simple html markup to display a list
// function renderTypeList()
const renderTypeList = (list) => {
  const element = document.getElementById("typeList");

  const cleanList = cleanTypeList(list.results);

  cleanList.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name}`;
    li.setAttribute("data-url", item.url);
    element.appendChild(li);
  });
};

// create click handler
function typeClickedHandler(event) {
  //   console.log(event.target);
  //   console.log(event.currentTarget);
  const selectType = event.target;
  // anything data-x attribute = dataset.x
  const url = selectType.dataset.url;
  getData(url, renderPokeList);
  setActive(url);
}

// render the list
const renderPokeList = (list) => {
  const element = document.getElementById("pokeList");
  element.innerHTML = "";

  const header = document.createElement("h2");
  header.innerHTML = `${list.name} (${list.pokemon.length})`;
  element.appendChild(header);

  // console.log(list);
  list.pokemon.forEach((item) => {
    const pokemon = item.pokemon;
    const li = document.createElement("li");
    li.innerHTML = `${pokemon.name}`;
    li.classList.add("pokemon");
    li.setAttribute("data-url", pokemon.url);
    element.appendChild(li);
  });
};

// set active item
function setActive(type) {
  const allTypes = document.querySelectorAll(".types > li");
  allTypes.forEach((item) => {
    if (item.dataset.url === type) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// there are no pokemon in unknown and shadow. Let's remove them from the list.
const cleanTypeList = (list) => {
  return list.filter(
    (item) => item.name !== "shadow" && item.name !== "unknown"
  );
};
