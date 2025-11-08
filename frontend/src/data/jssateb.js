// src/data/jssateb.js
export const POIS = [
  { id: "main-gate", name: "Main Gate", category: "Entrance", lat: 12.8759, lng: 77.5609 },
  { id: "admin", name: "Administration Block", category: "Admin", lat: 12.8764, lng: 77.5615 },
  { id: "cse", name: "CSE Block", category: "Department", lat: 12.8769, lng: 77.5620 },
  { id: "ece", name: "ECE Block", category: "Department", lat: 12.8774, lng: 77.5617 },
  { id: "me",  name: "Mechanical Block", category: "Department", lat: 12.8768, lng: 77.5606 },
  { id: "lib", name: "Central Library", category: "Facility", lat: 12.8762, lng: 77.5619 },
  { id: "audi", name: "Auditorium", category: "Facility", lat: 12.8758, lng: 77.5612 },
  { id: "caf", name: "Cafeteria", category: "Food", lat: 12.8757, lng: 77.5622 },
  { id: "hostel", name: "Hostel", category: "Residence", lat: 12.8749, lng: 77.5616 },
];

export const DEFAULT_CENTER = [POIS[0].lat, POIS[0].lng];
