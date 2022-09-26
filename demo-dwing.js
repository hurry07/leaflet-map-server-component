const components = require("server-components");
const document = require("./src/document");

require("./src/index.js");

const express = require("express");
const app = express();

app.use(require("./node_modules/server-components-express/src/index.js")); // 绑定渲染器

const html = `
<html>
<head></head>
<body>
    <leaflet-map lat="32.03589507612928" long="118.8263458095818" zoom="18">
        <leaflet-marker lat="41.4036" long="2.1744"></leaflet-marker>
        <leaflet-marker lat="41.4225" long="2.1186"></leaflet-marker>
        <leaflet-marker lat="41.3640" long="2.1675"></leaflet-marker>
    </leaflet-map>
</body>
</html>
`;

(async function () {
  const doc = await document.renderDocument(html);
  const images = Array.from(doc.querySelectorAll(".leaflet-tile"));
  images.forEach((tile) => {
    const { left, top, width, height } = tile.style;
    console.log(tile.src, left, top, width, height);
  });
})();

// Do an initial render before requests, to check whether it works
components.renderPage(html).then((result) => {
  console.log("Initial render successful");
  // console.log('result:', result);
}).catch((err) => {
  console.error("Error on initial render", err);
});

// Start a server rendering on demand
app.get('/', (req, res) => {
  return res.renderPage(html);
});
app.use(express.static('.'));
app.listen(3000, () => console.log("Server listening on 3000"));
