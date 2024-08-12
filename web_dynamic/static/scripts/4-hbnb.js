$(document).ready(function () {
    // Object to store checked amenities
    const amenities = {};

    // Event handler for checkbox clicks
    $('input[type="checkbox"]').click(function () {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');
        
        if ($(this).prop('checked')) {
            amenities[amenityId] = amenityName;
        } else {
            delete amenities[amenityId];
        }
        
        // Update the displayed list of amenities
        updateAmenityList();
    });

    function updateAmenityList() {
        const amenityList = Object.values(amenities).join(', ');
        if (amenityList.length > 30) {
            $('.amenities h4').text(amenityList.substring(0, 30) + '...');
        } else {
            $('.amenities h4').text(amenityList);
        }
        if ($.isEmptyObject(amenities)) {
            $('.amenities h4').html('&nbsp;');
        }
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

    // Initial fetch of places
    fetchPlaces();

    // Event handler for the filter button click
    $('.container .filters button').click(function () {
        fetchPlaces();
    });

    function fetchPlaces() {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: Object.keys(amenities)
            }),
            success: function (places) {
                // Clear previous places
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
});
