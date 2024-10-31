// Ladataan suosituimmat artistit heti sivun latauduttua
window.onload = function() {
    fetchTopArtists();
}

// API-avain Last.fm:n API-kutsuja varten
const apiKey = "ce2e5235f78694a6af791f8800e9a6d0";

// Hakee suosituimmat artistit Last.fm:n API:sta
function fetchTopArtists() {
    let url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayTopArtists(data); // Kutsuu displayTopArtists-funktiota datan näyttämiseksi
        })
        .catch(error => console.error("Virhe haettaessa suosituimpia artisteja", error));
}

// Näyttää kymmenen suosituinta artistia sivulla
function displayTopArtists(data) {
    let artistContainer = document.getElementById("artistContainer");
    artistContainer.innerHTML = "<b>LastFM Top 10 artists:</b>"; // Otsikko listalle

    // Poimitaan 10 ensimmäistä artistia
    let artists = data.artists.artist.slice(0, 10);

    // Luodaan elementit jokaiselle artistille
    artists.forEach(artist => {
        let artistImage = artist.image[1]["#text"]; // Artisti kuva
        let artistName = artist.name; // Artisti nimi
        let artistItem = document.createElement("div"); // Artisti-elemntti
        artistItem.className = "artistItem";

        // Nimi-elementti klikkaustapahtumaa varten
        let nameElement = document.createElement("p");
        nameElement.textContent = artistName;
        nameElement.style.cursor = "pointer";

        // Kuvan luonti
        let imgElement = document.createElement("img");
        imgElement.src = artistImage;
        imgElement.alt = `${artistName} kuva`;

        // Luodaan trackContainer artistin kappaleiden näyttämistä varten
        let trackContainer = document.createElement("div");
        trackContainer.className = "trackContainer";

        // Lisää klikkaustapahtuma artistin nimen yhteyteen
        nameElement.addEventListener("click", function() {
            if (trackContainer.innerHTML === "") {
                // Jos trackContainer on tyhjä, haetaan kappaleet
                fetchTopTracks(artistName, trackContainer);
            } else {
                // Muussa tapauksessa tyhjennetään kappalelista
                trackContainer.innerHTML = "";
            }
        });

        // Lisää kaikki elementit artistikonteineriin
        artistItem.appendChild(nameElement);
        artistItem.appendChild(trackContainer);
        artistContainer.appendChild(artistItem);
        artistItem.appendChild(imgElement);
    });
}

// Hakee valitun artistin tietoja ja kappaleita
function fetchArtistDetails() {
    const artistName = document.getElementById("artistSelect").value;
    if (artistName) {
        fetchTopTracks(artistName);  
        searchArtists();
    }
}

// Hakee artistin tietoja käyttäjän syötteen perusteella
function searchArtists() {
    let artistName = document.getElementById("artistInput").value;
    let url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let artists = data.results.artistmatches.artist;
            // Suodatetaan täsmäosumat hakutuloksista
            let exactMatches = artists.filter(artist => artist.name.toLowerCase() === artistName.toLowerCase());

            displaySearchResults({ results: { artistmatches: { artist: exactMatches } } });
        })
        .catch(error => console.error("Virhe haettaessa dataa:", error));
}

// Näyttää hakutuloksissa täsmäosumat artisteista
function displaySearchResults(data) {
    let artistContainer = document.getElementById("artistContainer");
    artistContainer.innerHTML = ""; // Tyhjennetään aiemmat tulokset

    let artists = data.results.artistmatches.artist;

    // Luodaan elementit hakutulosten artisteille
    artists.forEach(artist => {
        let artistName = artist.name;
        let artistImage = artist.image[1]["#text"];

        let artistItem = document.createElement("div");
        
        // Nimi-elementti klikkaustapahtumaa varten
        let nameElement = document.createElement("p");
        nameElement.textContent = artistName;

        // Kuvan luonti
        let imgElement = document.createElement("img");
        imgElement.src = artistImage;
        imgElement.alt = `${artistName} kuva`;

        // Luodaan trackContainer hakutuloksen kappaleita varten
        let trackContainer = document.createElement("div");
        trackContainer.className = "trackContainer";

        // Lisää tapahtumakuuntelija artistille
        nameElement.addEventListener("click", function() {
            if (trackContainer.innerHTML === "") {
                fetchTopTracks(artistName, trackContainer); 
            } else {
                trackContainer.innerHTML = ""; // Tyhjentää kappalelistan uudella klikkauksella
            }
        });

        artistItem.appendChild(nameElement);
        artistItem.appendChild(imgElement);
        artistItem.appendChild(trackContainer); 
        artistContainer.appendChild(artistItem);
    });
}

// Hakee artistin viisi suosituinta kappaletta
function fetchTopTracks(artistName, trackContainer) {
    let url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayTopTracks(data, trackContainer); // Näyttää kappaleet trackContainerissa
        })
        .catch(error => console.error("Virhe haettaessa kappaleita:", error));
}

// Näyttää artistin viisi suosituinta kappaletta annetussa trackContainerissa
function displayTopTracks(data, trackContainer) {
    trackContainer.innerHTML = ""; // Tyhjennetään aiemmat kappaleet

    // Poimitaan 5 ensimmäistä kappaletta
    let tracks = data.toptracks.track.slice(0, 5);

    // Luodaan elementit jokaiselle kappaleelle
    tracks.forEach(track => {
        let trackName = track.name;
        let trackItem = document.createElement("p");
        trackItem.textContent = trackName;
        trackContainer.appendChild(trackItem);
    });
}
