/*
 NOM : O LEA
 GROUPE : M1-Groupe2-PW
*/


/*
 Créer l'élément DOM div.film correspondant au film d'indice 'index' de filmData (selectFilm).
 Pour cela on doit créer l'élément div, img et h3.
 L'élément div contiendra l'affiche et le titre grâce aux éléments img et h3 créés.
 Pour l'élément img il faut la propriété src et alt.
 Pour l'élément h3 il faut insérer le titre.
 @param {number} index 
 @return {Element} film
*/

function createFilm(index) {

    var selectfilm = filmData[index];
    var film = document.createElement("div");
    film.className = "film";
    film.id = index + "-film";
    var image = document.createElement("img");
    image.src = selectfilm.image;
    image.alt = selectfilm.title;
    film.appendChild(image);
    var titre = document.createElement("h3");
    var texttitre = document.createTextNode(selectfilm.title);
    titre.appendChild(texttitre);
    film.appendChild(titre);
    return film;
}

/*
 Chargement de tous les films dans le catalogue #films:
 Pour chaque élément dans filmData, on l'ajoute au catalogue.
*/

var catalogue = document.getElementById("films");
for (var i = 0; i < filmData.length; i++) {
    catalogue.appendChild(createFilm(i));
}

/*
 Filtre les films sur #films en comparant avec la valeur de l'input #filter:
 -Récupère la valeur de l'input #filter (en le mettant en minuscule)
 -Récupère tous les div.film du catalogue #films
 -Pour chaque film affichés dans le catalogue on compare le titre (en le mettant en minuscule) et la valeur de #filter
 -Affiche le div.film s'il contient la valeur sinon le cache.
*/
function filterFilms() {
    var valeur = document.getElementById("filter").value.toLowerCase();
    var films = document.querySelectorAll("#films div.film");
    for (var i = 0; i < films.length; i++) {
        var titreFilm = (films[i].getElementsByTagName("h3")[0].innerText).toLowerCase();
        if (titreFilm.includes(valeur)) {
            films[i].style.display = "";
        } else {
            films[i].style.display = "none";
        }
    }
}

/*Ajoute événement filterFilms pour que à chaque événement de keyup sur #filter, les films soit filtrés*/
document.getElementById("filter").addEventListener("keyup", filterFilms);

/*Affiche le div.details si #showDetails est coché ou non*/
function showDetails() {
    var details = document.getElementById("details");
    var show = document.getElementById("showDetails");
    if (show.checked == true) {
        details.style.display = "";
    } else {
        details.style.display = "none";
    }
}
/*Ajoute événement showDetails pour que à chaque événement click sur #showDetails, le detail s'affiche ou pas*/
document.getElementById("showDetails").addEventListener("click", showDetails);

/* Pour chaque film, on va associer les événements mouseover et mouseout pour afficher/cacher la description */
var films = document.querySelectorAll("#films div.film");
for (var i = 0; i < films.length; i++) {
    films[i].addEventListener("mouseover", function() {
        var description = document.getElementById("details");
        var i = parseInt(this.id.split("-")[0]);
        description.innerHTML = filmData[i].text;
    });
    films[i].addEventListener("mouseout", function() {
        var description = document.getElementById("details");
        description.innerHTML = "";
    });
}

/*
 Pour chaque film, on va associer l'événement click pour mettre/enlever le film dans un emplacement de favoris 
 Sinon une boite d'alert s'affiche indiquant qu'aucun emplacement n'est libre.
 -favoris1  indice du film sur #select1, -1 sinon
 -favoris2 indice du film sur #select2, -1 sinon
 -genretype le genre si il y a filtrage , "all genre" sinon (pour question 10)
*/

var favoris1 = -1;
var favoris2 = -1;
var genretype = "all genre";
for (var i = 0; i < films.length; i++) {
    films[i].addEventListener("click", function() {
        var select1 = document.getElementById("select1");
        var span1 = document.querySelector("#select1 span");
        var select2 = document.getElementById("select2");
        var span2 = document.querySelector("#select2 span");
        var parent = this.parentNode;
        if (parent == document.getElementById("select1")) {
            var film = document.querySelector("#select1 div.film");
            document.getElementById("films").appendChild(film);
            /*Vérifie si le film en question ne fait pas partie du filtrage par genre mais qu'il est en favoris afin de le cacher si l'utilisateur souhaite l'enlever du favoris */
            if (!filmData[parseInt(this.id.split("-")[0])].genre.includes(genretype)) this.style.display = "none";
            favoris1 = -1;
        } else if (parent == document.getElementById("select2")) {
            var film = document.querySelector("#select2 div.film");
            document.getElementById("films").appendChild(film);
            if (!filmData[parseInt(this.id.split("-")[0])].genre.includes(genretype)) this.style.display = "none";
            favoris2 = -1;
        } else if (favoris1 == -1) {
            select1.insertBefore(this, span1);
            favoris1 = parseInt(this.id.split("-")[0]);
        } else if (favoris1 != -1 && favoris2 == -1) {
            select2.insertBefore(this, span2);
            favoris2 = parseInt(this.id.split("-")[0]);
        } else if (favoris1 != -1 && favoris2 != -1) {
            window.alert("Vous avez déja deux films en favoris !");
        }

    });
}
/*
Créer l'élément DOM div.genre correspondant au genre de la variable globale genre.
Créer l'évenement click du div.genre permettant de filtrer les #films selon le genre.
 Pour cela on doit créer l'élément div, input et label.
 L'élément div contiendra l'input et son label.
 Pour l'élément input sera de type radio et d'id du nom du genre.
 Pour l'élément label sera associé à l'input grâce à son id.
 @param {string,string} nom ,value : nom du genre et nombre de films qui lui est associé
 @return {Element} div
*/
function createGenre(nom, value) {
    var div = document.createElement("div");
    div.className = "genre";
    var genre = document.createElement("input");
    genre.setAttribute("type", "radio");
    genre.setAttribute("name", "genre");
    genre.setAttribute("id", nom)
    genre.addEventListener("click", function() {
        genretype = nom;
        for (var i = 0; i < films.length; i++) {
            if (nom != "all genre") {
                if (filmData[i].genre.includes(nom)) {
                    films[i].style.display = "";
                } else {
                    /* Si le film ne fait pas partie du genre mais fait partie des favoris ne le cache pas (pour question 10)*/
                    if (favoris1 == i) films[i].style.display = "";
                    else films[i].style.display = "none";

                }
            } else {
                films[i].style.display = "";
            }
        }
    });
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(nom + "(" + value + ")"));
    div.appendChild(genre);
    div.appendChild(label);
    return div;
}

/* Chargement de tous les genre dans le catalogue #genres grâce à createGenre()
  Pour cela on récupère les clés et valeur de la variable genre.
  On regarde pour chaque filmData si il contient le genre en question : +1 pour le nombre de films de ce type (key)
*/
for (var [key, value] of Object.entries(genre)) {
    for (var i = 0; i < filmData.length; i++) {
        if (filmData[i].genre.includes(`${key}`)) genre[`${key}`] += 1;
        console.log(genre[`${key}`]);
    }
    document.getElementById("genres").appendChild(createGenre(`${key}`, genre[`${key}`]));
}
/*
Filtre les genres sur #genres en comparant avec la valeur de l'input #filtergenre:
 -Récupère la valeur de l'input
 -Récupère tous les div.gnere du catalogue #genres
 -Pour chaque genres affichés dans le catalogue on compare le titre et la valeur de #filtergenre
 -Affiche le div.genre s'il contient la valeur sinon le cache.
 */
function filterGenres() {
    var valeur = document.getElementById("filtergenre").value.toLowerCase();
    var genres = document.querySelectorAll("#genres div.genre");
    for (var i = 0; i < genres.length; i++) {
        var titreGenre = (genres[i].getElementsByTagName("label")[0].innerText).toLowerCase();
        if (titreGenre.includes(valeur)) {
            genres[i].style.display = "";
        } else {
            genres[i].style.display = "none";
        }
    }
}
/*Ajoute événement filterGenres pour que à chaque événement de keyup sur #filtergenre, les genres soit filtrés*/
document.getElementById("filtergenre").addEventListener("keyup", filterGenres);
