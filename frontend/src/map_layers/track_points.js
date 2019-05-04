export default {
  style: `
  #layer {
    marker-width: 7;
    marker-fill: #EE4D5A;
    marker-fill-opacity: 0.9;
    marker-allow-overlap: true;
    marker-line-width: 1;
    marker-line-color: #FFFFFF;
    marker-line-opacity: 1;
  }
  `,

  source: `
  SELECT
      cartodb_id, rental_id, start_point_lat, start_point_lon, end_point_lat, end_point_lon, started_at, ended_at, user_id, system_name, vehicle_external_id, duration_in_seconds, billable_duration_in_seconds, first_checkout_attempt_at, first_checkout_attempt_error, first_checkout_attempt_error_details, first_checkout_attempt_id, first_checkout_attempt_state, last_checkout_attempt_at, last_checkout_attempt_error, last_checkout_attempt_error_details, last_checkout_attempt_id, last_checkout_attempt_state, first_odometer_in_meters, first_odometer_recorded_at, last_odometer_in_meters, last_odometer_recorded_at, pause_duration, pause_duration_in_seconds, reservation_at, reservation_point,
      ST_SetSRID(
        ST_MakePoint(
        start_point_lon,
        start_point_lat
      ), 4326) AS the_geom,
      ST_Transform(
        ST_Buffer(ST_SetSRID(
        ST_MakePoint(
        start_point_lon,
        start_point_lat
      ), 4326), 0.001)
        , 3857) as the_geom_webmercator
  FROM "ecooltra-carto-04".hackaton_data_rentals AS _camshaft_georeference_long_lat_analysis
  `
}
