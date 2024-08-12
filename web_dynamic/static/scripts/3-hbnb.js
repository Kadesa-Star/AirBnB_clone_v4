document.addEventListener("DOMContentLoaded", function() {
    // Fetch places from the API
    fetch("http://0.0.0.0:5001/api/v1/places_search/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        // Handle the data and populate the page
        const placesSection = document.querySelector('section.places');
        placesSection.innerHTML = ''; // Clear any existing content

        data.forEach(place => {
            const article = document.createElement('article');
            article.innerHTML = `
                <div class="title">
                    <h2>${place.name}</h2>
                </div>
                <div class="description">
                    ${place.description}
                </div>
            `;
            placesSection.appendChild(article);
        });
    })
    .catch(error => {
        console.error("Error fetching places:", error);
    });
});
