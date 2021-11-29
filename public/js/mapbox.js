/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29kaW5ndHV0b3JpYWwxMDEiLCJhIjoiY2t3Z2R1NDBqMG5qNzJucXZxcDYxMjBtayJ9.csThekJ3K075esucvNs1sA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/codingtutorial101/ckwgejov508wn14pg8nw8wdji/draft',
    scrollZoom: false
    //   center: [-118.113491, 34.111745],
    //   zoom: 10
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to inclode locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
