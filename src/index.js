const componentsStatic = require('server-components-static');
const resolvePkg = require("resolve-pkg");

require("server-components").onServer = true;
require("./document").onServer = true;

// Configure path for this component's static content
const mapContent = componentsStatic.forComponent("leaflet-map");
mapContent.setPath(__dirname);

// Make /components/leaflet/* map to leaflet's resources.
const leafletContent = componentsStatic.forComponent("leaflet");
leafletContent.setPath(resolvePkg("leaflet"), "dist");

// Load the component components
require("./leaflet-map");
require("./leaflet-marker");
