export default {
  style: `
#layer {
marker-width: 45;
marker-fill: white;
marker-fill-opacity: 1;
marker-file: url(https://cartodb-libs.global.ssl.fastly.net/cartodbui/assets/unversioned/images/alphamarker.png);
marker-allow-overlap: true;
marker-line-width: 1;
marker-line-color: #FFFFFF;
marker-line-opacity: 1;
image-filters: colorize-alpha(#4b2991,#872ca2,#c0369d,#ea4f88,#fa7876,#f6a97a,#edd9a3);
}
  `,

  source: `
  SELECT * FROM "ecooltra-carto-04".hackaton_data_rentals
  `
}
