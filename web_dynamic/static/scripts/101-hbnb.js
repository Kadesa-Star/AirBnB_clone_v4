$(document).ready(function () {
    const amenities = {};
    const states = {};
    const cities = {};

    // Event handler for checkboxes
    $('input[type="checkbox"]').click(function () {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');

        if ($(this).closest('ul').length === 0) {
            // It's an amenity checkbox
            if ($(this).prop('checked')) {
                amenities[id] = name;
            } else {
                delete amenities[id];
            }
        } else if ($(this).closest('ul').length === 1) {
            // It's a state checkbox
            if ($(this).prop('checked')) {
                states[id] = name;
            } else {
                delete states[id];
            }
        } else {
            // It's a city checkbox
            if ($(this).prop('checked')) {
                cities[id] = name;
            } else {
                delete cities[id];
            }
        }

        updateFilterLists();
    });

    function updateFilterLists() {
        const amenityList = Object.values(amenities).join(', ');
        $('.amenities h4').text(amenityList.length > 30 ? amenityList.substring(0, 30) + '...' : amenityList);

        const stateList = Object.values(states).join(', ');
        $('.locations h4').text(stateList.length > 30 ? stateList.substring(0, 30) + '...' : stateList);
    }

    // Check API status
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'OK') {
                $('DIV#api_status').addClass('available');
            } else {
                $('DIV#api_status').removeClass('available');
            }
        },
        error: function () {
            $('DIV#api_status').removeClass('available');
        }
    });

    // Fetch and display places
    function fetchPlaces() {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: Object.keys(amenities),
                states: Object.keys(states),
                cities: Object.keys(cities)
            }),
            success: function (places) {
                $('article').remove();
                $.get('http://0.0.0.0:5001/api/v1/users/', function(users) {
                    places.forEach(place => {
                        const user = users.find(u => u.id === place.user_id);
                        if (user) {
                            const article = `
                            <article>
                                <div class="title">
                                    <h2>#${place.name}</h2>
                                    <div class="price_by_night">$${place.price_by_night}</div>
                                </div>
                                <div class="information">
                                    <div class="max_guest">
                                        <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                                        <br />${place.max_guest} Guests
                                    </div>
                                    <div class="number_rooms">
                                        <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                                        <br />${place.number_rooms} Bedrooms
                                    </div>
                                    <div class="number_bathrooms">
                                        <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                                        <br />${place.number_bathrooms} Bathroom
                                    </div>
                                </div>
                                <div class="user">
                                    <strong>Owner: ${user.first_name} ${user.last_name}</strong>
                                </div>
                                <div class="description">${place.description}</div>
                            </article>`;
                            $("section.places").append(article);
                        }
                    });
                });
            }
        });
    }

    // Toggle reviews visibility
    $('#toggle-reviews').click(function () {
        const action = $(this).attr('data-action');

        if (action === 'show') {
            $.get('http://0.0.0.0:5001/api/v1/reviews/', function(reviews) {
                let reviewsHtml = '';
                reviews.forEach(review => {
                    reviewsHtml += `
                    <div class="review">
                        <h3>${review.title}</h3>
                        <p>${review.text}</p>
                        <small>by ${review.user.first_name} ${review.user.last_name} on ${review.created_at}</small>
                    </div>`;
                });
                $('.reviews-container').append(reviewsHtml);
                $('#toggle-reviews').text('hide').attr('data-action', 'hide');
            });
        } else {
            $('.reviews-container .review').remove();
            $('#toggle-reviews').text('show').attr('data-action', 'show');
        }
    });

    // Event handler for the filter button click
    $('.container .filters button').click(function () {
        fetchPlaces();
    });
});
