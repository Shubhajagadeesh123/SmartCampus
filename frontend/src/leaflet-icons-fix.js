import L from "leaflet";
import "leaflet/dist/leaflet.css";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker    from "leaflet/dist/images/marker-icon.png";
import shadow    from "leaflet/dist/images/marker-shadow.png";

/* Build a complete default icon with the right sizes/anchors */
const DefaultIcon = L.icon({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
  iconSize:     [25, 41],
  iconAnchor:   [12, 41],
  popupAnchor:  [ 1,-34],
  tooltipAnchor:[16,-28],
  shadowSize:   [41, 41],
});

/* Use it for all markers unless you pass a different icon */
L.Marker.prototype.options.icon = DefaultIcon;
