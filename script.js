

let stackCurrentMovie = [];

const homeButton = document.querySelector("#homeButton");
const searchBox = document.querySelector("#searchBox");
const goToFavouriteButton = document.querySelector("#gotoFavouritesButton");
const movieCardContainer = document.querySelector("#movieCardContainer")
var name ="";

// To display an alert when we need 
function showAlert(message){
	alert(message);
}


// Generate movie cards utilizing the elements from the stackCurrentMovie array.
function renderList(actionButton){
	movieCardContainer.innerHTML = '';

	if(actionButton=="favourite"){
		name="Add To Favourite";
	}else{
		name=actionButton;
	}
	

	for(let i = 0; i<stackCurrentMovie.length; i++){

		// Constructing a div element representing a movie card, while assigning it a specific class and id.
		let movieCard = document.createElement('div');
		movieCard.classList.add("movieCard");

		// To provide a template for an HTML movie card that includes the image, title, and rating of a specific movie. 
		movieCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + stackCurrentMovie[i].poster_path}" alt="${stackCurrentMovie[i].title}" class="moviePoster">
		<div class="movieTitleContainer">
			<span>${stackCurrentMovie[i].title}</span>
			<div class="ratingContainer">
				<img src="./pic/icon-of-rating.jpg" alt="">
				<span>${stackCurrentMovie[i].vote_average}</span>
			</div>
		</div>

		<button id="${stackCurrentMovie[i].id}" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>

		<button onclick="${actionButton}(this)" class="addToFavouriteButton textIconButton" data-id="${stackCurrentMovie[i].id}" >
			<img src="./pic/favourites-of-icon.png">

			<span>${name}</span>
		</button>
		`;
		movieCardContainer.append(movieCard); //Adding a card to the movie container view.
		
	}
}


// If any errors occur while utilizing this function, we will display a message on the main screen.
function printError(message){
	const errorDiv = document.createElement("div");
	errorDiv.innerHTML = message;
	errorDiv.style.height = "100%";
	errorDiv.style.fontSize = "5rem";
	errorDiv.style.margin = "auto";
	movieCardContainer.innerHTML = "";
	movieCardContainer.append(errorDiv);
}

// Retrieves popular movies from the server and displays them as movie cards.
function getTrendingMovie(){
	const tmdb = fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=f8d2b5a2f9231c44931ef6e8bee78f68")
	.then((response) => response.json())
	.then((data) => {
		stackCurrentMovie = data.results;
		renderList("favourite");
	})
	.catch((err) => printError(err));
}
getTrendingMovie();

// Upon clicking the home button, the webpage retrieves the latest movie releases and displays.
homeButton.addEventListener('click', getTrendingMovie);




// Create an event listener for the search box that detects any key press, allowing users to search for movies and display the results on the web page.
searchBox.addEventListener('keyup' , ()=>{
	let searchString = searchBox.value;
	
	if(searchString.length > 0){
		let searchStringURI = encodeURI(searchString);
		const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=f8d2b5a2f9231c44931ef6e8bee78f68&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
			.then((response) => response.json())
			.then((data) =>{
				stackCurrentMovie = data.results;
				renderList("favourite");
			})
			.catch((err) => printError(err));
	}
})


// a function for including a movie in the favorites section.
function favourite(element){
	let id = element.dataset.id;
	for(let i = 0; i< stackCurrentMovie.length; i++){
		if(stackCurrentMovie[i].id == id){
			let myFavouriteMovies = JSON.parse(localStorage.getItem("myFavouriteMovies"));
			
			if(myFavouriteMovies == null){
				myFavouriteMovies = [];
			}

			myFavouriteMovies.unshift(stackCurrentMovie[i]);
			localStorage.setItem("myFavouriteMovies", JSON.stringify(myFavouriteMovies));

			showAlert(stackCurrentMovie[i].title + " added to favourite")
			return;
		}
	}
}

// When the "Favorites" movie button is clicked, it displays the list of favorite movies.
goToFavouriteButton.addEventListener('click', ()=>{
	let myFavouriteMovies = JSON.parse(localStorage.getItem("myFavouriteMovies"));
	if(myFavouriteMovies == null || myFavouriteMovies.length < 1){
		showAlert("you have not added any movie to favourite");
		return;
	}

	stackCurrentMovie = myFavouriteMovies;
	renderList("remove");
})


// for removing movies from favourite section
function remove(element){
	let id = element.dataset.id;
	let myFavouriteMovies = JSON.parse(localStorage.getItem("myFavouriteMovies"));
	let newFavouriteMovies = [];
	for(let i = 0; i<myFavouriteMovies.length; i++){
		if(myFavouriteMovies[i].id == id){
			continue;
		}
		newFavouriteMovies.push(myFavouriteMovies[i]);
	}
	
	localStorage.setItem("myFavouriteMovies", JSON.stringify(newFavouriteMovies));
	stackCurrentMovie = newFavouriteMovies;
	renderList("remove");
}



// details of renders movie on web-page
function renderMovieInDetail(movie){
	console.log(movie);
	movieCardContainer.innerHTML = '';
	
	let movieDetailCard = document.createElement('div');
	movieDetailCard.classList.add('detailMovieCard');

	movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detailMovieBackground">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detailMoviePoster">
		<div class="detailMovieTitle">
			<span>${movie.title}</span>
			<div class="detailMovieRating">
				<img src="./pic/rating-icon.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="detailMoviePlot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

	movieCardContainer.append(movieDetailCard);
}


// Retrieve the information about the movie and forward it to the renderMovieDetails function for presentation.
function getMovieInDetail(element){

	fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=f8d2b5a2f9231c44931ef6e8bee78f68&language=en-US`)
		.then((response) => response.json())
		.then((data) => renderMovieInDetail(data))
		.catch((err) => printError(err));

}