$(document).ready(function () {
    const amenities = {}; // Object to track selected amenities

    $('input[type="checkbox"]').on('change', function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        // Add or remove the amenity from the object based on the checkbox state
        if ($(this).is(':checked')) {
            amenities[amenityId] = amenityName;
        } else {
            delete amenities[amenityId];
        }

        // Create a comma-separated list of selected amenities
        const amenityList = Object.values(amenities).join(', ');

        // Update the h4 element with the list of selected amenities
        if (amenityList.length > 30) {
            $('.amenities h4').text(amenityList.substring(0, 29) + '...');
        } else {
            $('.amenities h4').text(amenityList);
        }

        // Handle the case when no amenities are selected
        if ($.isEmptyObject(amenities)) {
            $('.amenities h4').html('&nbsp;');
        }
    });
});
