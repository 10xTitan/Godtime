document.getElementById('getTimes').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchPrayerTimes, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function fetchPrayerTimes(position) {
    const faith = document.getElementById('faithSelect').value;
    if (faith === 'islam') {
        const method = 2; // Default method, can be changed
        const url = `https://api.aladhan.com/v1/timings?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=${method}`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayTimes(data.data.timings))
            .catch(error => console.error('Error:', error));
    } else {
        alert('Prayer times for the selected faith are not available.');
    }
}

function displayTimes(times) {
    const table = document.getElementById('infoTable');
    table.innerHTML = '<tr><th>Prayer</th><th>Time</th></tr>';
    for (const [key, value] of Object.entries(times)) {
        table.innerHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
}

function showError(error) {
    // ... Existing showError function ...
}


// Initialize the map and mosque finder
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 14
            });

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: currentLocation,
                radius: 5000, // Search within 5km radius
                type: ['mosque']
            }, processResults);
        }, showError);
    }
}

function processResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var map = new google.maps.Map(document.getElementById('map'));
    new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}

// ... existing showError function ...
