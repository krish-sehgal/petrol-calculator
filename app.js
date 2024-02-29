let form = document.querySelector('#petrolForm');
let resultDiv = document.querySelector('#result');
let liveTag = document.querySelector('.live-tag');
let resultDigit = document.querySelector('.number');
let rate, mileage;

document.getElementById('petrolForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    rate = parseFloat(document.getElementById('rate').value);
    mileage = parseFloat(document.getElementById('mileage').value);

    form.style.display = 'none';
    resultDiv.style.display = 'block';
    
});

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Function to track distance traveled
function trackDistance() {
    let totalDistance = 0;
    let lastPosition = null;

    // Callback function for handling position updates
    function handlePosition(position) {
        const { latitude, longitude } = position.coords;
        if (lastPosition) {
            const distance = calculateDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
            totalDistance += distance;
            // console.log("Distance traveled:", totalDistance.toFixed(2), "kilometers");
            resultDigit.innerText = totalDistance * (rate / mileage);
        }
        lastPosition = { latitude, longitude };
    }

    // Error callback function
    function handleError(error) {
        console.error("Error getting location:", error);
    }

    let watchId; // To store the watch position ID

    // Start tracking when the button is clicked
    document.getElementById("startButton").addEventListener("click", function() {
        if ('geolocation' in navigator) {
            // Start watching position changes
            watchId = navigator.geolocation.watchPosition(handlePosition, handleError);
            console.log("Started tracking distance.");
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
        liveTag.style.display = 'block';
    });

    // Stop tracking when the button is clicked
    document.getElementById("stopButton").addEventListener("click", function() {
        if (watchId) {
            // Clear the watch position
            navigator.geolocation.clearWatch(watchId);
            console.log("Stopped tracking distance.");
            liveTag.style.display = 'none';
        }
    });
}

// Call the function to start tracking distance
trackDistance();
