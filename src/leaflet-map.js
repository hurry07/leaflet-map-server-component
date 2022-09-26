(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    factory(require('server-components'), require('server-components-static'), require('./leaflet-for-server'));
    factory(require('./document'), require('server-components-static'), require('./leaflet-for-server'));
  } else {
    factory(root.components,
      root.componentsStatic,
      root.L);
  }
}(this, function (components, componentsStatic, leafletOrConstructor) {
  const LeafletMapElement = components.newElement();

  LeafletMapElement.createdCallback = function (document) {
    const L = components.onServer ?
      leafletOrConstructor(new components.dom.Window(), document) :
      leafletOrConstructor;

    const leafletContent = componentsStatic.forComponent("leaflet");
    const mapContent = componentsStatic.forComponent("leaflet-map");

    L.Icon.Default.imagePath = leafletContent.getUrl("images");
    componentsStatic.includeCSS(document, mapContent.getUrl("leaflet-map.css"));
    componentsStatic.includeCSS(document, leafletContent.getUrl("leaflet.css"));

    // Add client-side scripts too, for later potential interactivity
    componentsStatic.includeScript(document, "/server-components-for-web.js");
    componentsStatic.includeScript(document, leafletContent.getUrl("leaflet.js"));
    componentsStatic.includeScript(document, mapContent.getUrl("leaflet-map.js"));

    if (components.onServer) {
      // Server-side we need to explicitly specify a size to render, since we don't have a window.
      this.clientWidth = 960;
      this.clientHeight = 640;
    }

    [].slice.call(this.querySelectorAll(".leaflet-map-pane, .leaflet-control-container")).forEach(function (node) {
      node.remove()
    });

    const lat = this.getAttribute("lat");
    const long = this.getAttribute("long");
    const zoom = this.getAttribute("zoom");

    const options = components.onServer ? { zoomControl: false } : {};

    function fitBounds(bounds, options) {
      options = options || {};
      bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

      let paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
        paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),
        zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

      zoom = (options.maxZoom) ? Math.min(options.maxZoom, zoom) : zoom;
      const paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

        swPoint = this.project(bounds.getSouthWest(), zoom),
        nePoint = this.project(bounds.getNorthEast(), zoom),
        center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

      console.log('center', center, zoom, options);
      return this.setView(center, zoom, options);
    }

    try {
      const map = L.map(this, options)
      fitBounds.call(map, [
        [32.03515814131867, 118.82382739102687],
        [32.03663201093989, 118.8288642281369]
      ]);
      // fitBounds.call(map, [
      //   [32.03515814131867, 118.82382739102687],
      //   [32.03663201093989, 118.8288642281369]
      // ], { maxZoom: 18 });

      // const map = L.map(this, options).fitBounds([
      //   [118.82382739102687, 32.03515814131867],
      //   [118.8288642281369, 32.03663201093989]
      // ], { maxZoom: 18 });

      console.log(lat, long, zoom);
      // const map = L.map(this, options).setView([lat, long], zoom);

      L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=88951fc0696d44bd02abe028314ec346', {
        maxZoom: 18,
        subdomains: '012345'
      }).addTo(map);

      L.tileLayer('https://alpha.kitebeam.com/forward/18175-30246/{z}/{x}/{y}', {
        maxZoom: 20,
      }).addTo(map);

      // Show tiles immediately (either we're server-side, and we need to get to ready state, or
      // we know we've already got the tiles ready from our pre-load, and we don't want a FOUC)
      const tiles = [].slice.call(document.querySelectorAll(".leaflet-tile"));
      tiles.forEach((tile) => {
        tile.onload()
      });

      // Export these properties on the element, so subelements can easily interact with it.
      this.L = L;
      this.map = map;
    } catch (e) {
      console.log(e);
    }
  };

  components.registerElement("leaflet-map", { prototype: LeafletMapElement });
}));
