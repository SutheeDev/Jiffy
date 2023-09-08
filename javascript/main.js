const API_KEY = "pmjGjRatDsqXncAsEwnjxCCj4esryzfU";
const searchEl = document.querySelector(".search-input");
const hintEl = document.querySelector(".search-hint");
const videos = document.querySelector(".videos");
const clearEl = document.querySelector(".search-clear");

// Randomly choose GIF from 50 results that we get back
const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

// Function to create video element
const createVideo = (src) => {
  const video = document.createElement("video");
  video.src = src;
  video.loop = true;
  video.autoplay = true;
  video.className = "video";
  return video;
};

const toggleLoading = (state) => {
  if (state) {
    document.body.classList.add("loading");
    searchEl.disabled = true;
  } else {
    document.body.classList.remove("loading");
    searchEl.disabled = false;
    searchEl.focus();
  }
};

const searchGiphy = (searchTerm) => {
  toggleLoading(true);
  // limit to 50 results in the url
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const gif = randomChoice(json.data);
      const src = gif.images.original.mp4;
      const video = createVideo(src);

      videos.appendChild(video);

      video.addEventListener("loadeddata", (event) => {
        video.classList.add("visible");
        toggleLoading(false);
        document.body.classList.add("has-results");
        hintEl.innerHTML = `Hit enter to search more ${searchTerm}`;
      });
    })
    .catch((error) => {
      toggleLoading(false);
      hintEl.innerHTML = `Nothing found for ${searchTerm}`;
    });
};

const doSearch = (event) => {
  const searchTerm = searchEl.value;
  // Show hint if when the user input more than two letters in the searchEl
  if (searchTerm.length > 2) {
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`;
    document.body.classList.add("show-hint");
  } else {
    document.body.classList.remove("show-hint");
  }

  // Invoke the searchGiphy() when entered
  if (event.key === "Enter" && searchTerm.length > 2) {
    searchGiphy(searchTerm);
  }
};

const clearSearch = (event) => {
  document.body.classList.remove("has-results");
  videos.innerHTML = "";
  hintEl.innerHTML = "";
  searchEl.value = "";
  searchEl.focus();
};

// Invoke the clearSearch when the esc key is released
document.addEventListener("keyup", (event) => {
  if (event.key == "Escape") {
    clearSearch();
  }
});

searchEl.addEventListener("keyup", doSearch);
clearEl.addEventListener("click", clearSearch);
