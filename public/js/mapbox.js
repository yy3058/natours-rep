/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoieXV5dTMwNTgiLCJhIjoiY2xmcHY5NDY2MDJpaTNwbnNpdWFqMTE0aSJ9.l0gfK5MMy4UTYdgSWoLYjw';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:
      'mapbox://styles/yuyu3058/clfpxyhnj008y01p9urtsxlfk', // style URL
    scrollZoom: false,
    //   center: [-118.893833, 34.249309],
    //   zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day:${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // extend map bounds to include current location
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  });
};
