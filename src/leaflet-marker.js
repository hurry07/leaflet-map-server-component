(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    factory(require('server-components'), require('server-components-static'));
    factory(require('./document'), require('server-components-static'));
  } else {
    factory(root.components,
      root.componentsStatic);
  }
}(this, function (components, componentsStatic) {
  function getClosest(start, elementSelector) {
    let el = start;
    while (el && !el.matches(elementSelector)) {
      el = el.parentNode;
    }
    return el;
  }

  const LeafletMarkerElement = components.newElement();
  LeafletMarkerElement.createdCallback = function (document) {
    componentsStatic.includeScript(document, "/src/leaflet-marker.js");

    const mapElement = getClosest(this, 'leaflet-map');

    const lat = this.getAttribute("lat");
    const long = this.getAttribute("long");

    const marker = mapElement.L.marker([lat, long]);
    marker.addTo(mapElement.map);
  };

  components.registerElement("leaflet-marker", { prototype: LeafletMarkerElement });
}));
