const GOOGLE_PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_PLACES_API_KEY =
    process.env.GOOGLE_PLACES_API_KEY || process.env.PLACES_API_KEY || '';

const normalize = (value = '') =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const buildSearchQueries = (title, location) => {
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();

    return [
        `${trimmedTitle}, ${trimmedLocation}, Manipal, Karnataka`,
        `${trimmedTitle}, ${trimmedLocation}`,
        `${trimmedTitle}, Manipal`,
    ];
};

const scorePlaceMatch = (place, title, location) => {
    const normalizedTitle = normalize(title);
    const normalizedLocation = normalize(location);
    const displayName = normalize(place.displayName?.text || '');
    const address = normalize(place.formattedAddress || '');

    let score = 0;

    if (displayName === normalizedTitle) score += 8;
    if (displayName.includes(normalizedTitle)) score += 5;
    if (address.includes(normalizedLocation)) score += 3;
    if (address.includes('manipal')) score += 2;
    if (Array.isArray(place.photos) && place.photos.length > 0) score += 4;

    return score;
};

const fetchPlaces = async (textQuery) => {
    const response = await fetch(GOOGLE_PLACES_TEXT_SEARCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos',
        },
        body: JSON.stringify({
            textQuery,
            pageSize: 5,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Places text search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.places || [];
};

const fetchPhotoUri = async (photoName) => {
    const photoUrl =
        `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1600&skipHttpRedirect=true&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(photoUrl);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Places photo fetch failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.photoUri || '';
};

const getApartmentImage = async (title, location) => {
    if (!GOOGLE_PLACES_API_KEY || !title || !location) {
        return '';
    }

    for (const query of buildSearchQueries(title, location)) {
        const places = await fetchPlaces(query);
        const rankedPlaces = [...places].sort(
            (left, right) => scorePlaceMatch(right, title, location) - scorePlaceMatch(left, title, location)
        );
        const bestPlace = rankedPlaces.find((place) => Array.isArray(place.photos) && place.photos.length > 0);

        if (bestPlace?.photos?.[0]?.name) {
            return fetchPhotoUri(bestPlace.photos[0].name);
        }
    }

    return '';
};

module.exports = {
    getApartmentImage,
};
