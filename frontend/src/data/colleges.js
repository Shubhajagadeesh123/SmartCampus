// Add/expand this list freely. placeId is optional; center is required.
export const COLLEGES = [
  {
    id: "rvce",
    name: "RV College of Engineering",
    city: "Bengaluru",
    center: { lat: 12.9237, lng: 77.4995 },
    // If you know a Google Places place_id, put it here to fetch richer details:
    placeId: "", 
    details: {
      address: "Mysore Rd, RV Vidyaniketan, Bengaluru",
      website: "https://rvce.edu.in",
    },
    pois: [
      { name: "Main Gate", lat: 12.9245, lng: 77.4983 },
      { name: "Central Library", lat: 12.9259, lng: 77.4978 },
      { name: "CSE Dept", lat: 12.9274, lng: 77.4999 },
    ],
  },
  {
    id: "iitm",
    name: "IIT Madras",
    city: "Chennai",
    center: { lat: 12.9916, lng: 80.2337 },
    placeId: "",
    details: { address: "Indian Institute of Technology, Chennai" },
    pois: [
      { name: "Main Gate", lat: 12.9869, lng: 80.2411 },
      { name: "Central Library", lat: 12.9908, lng: 80.2318 },
    ],
  },
  {
    id: "nitk",
    name: "NITK Surathkal",
    city: "Mangaluru",
    center: { lat: 13.0108, lng: 74.7924 },
    placeId: "",
    details: { address: "NH 66, Surathkal, Mangalore" },
    pois: [
      { name: "Main Building", lat: 13.0103, lng: 74.7926 },
    ],
  },
];
