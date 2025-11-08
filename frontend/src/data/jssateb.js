// src/data/jssateb.js
// 👉 Replace lat/lng with actual campus coordinates
export const POIS = [
  { id: "gate", name: "Main Gate", lat: 12.8976, lng: 77.5189, category: "Gate" },
  { id: "cse",  name: "CSE Block", lat: 12.8981, lng: 77.5196, category: "Department" },
  { id: "lib",  name: "Central Library", lat: 12.8986, lng: 77.5192, category: "Library" },
  { id: "adm",  name: "Administration", lat: 12.8979, lng: 77.5199, category: "Office" },
  { id: "caf",  name: "Cafeteria", lat: 12.8983, lng: 77.5202, category: "Food" },
  // …add rooms like: { id:"r101", name:"Room 101 (CSE)", lat:..., lng:..., category:"Room" }
];

// Optional: campus walking graph (better campus pathfinding)
// NODES: id → {lat,lng}; EDGES: id → [{to, w}, ...]
export const NODES = {
  gate: { lat: 12.8976, lng: 77.5189 },
  node1: { lat: 12.8979, lng: 77.5193 },
  node2: { lat: 12.8982, lng: 77.5196 },
  lib:  { lat: 12.8986, lng: 77.5192 },
  cse:  { lat: 12.8981, lng: 77.5196 },
  adm:  { lat: 12.8979, lng: 77.5199 },
  caf:  { lat: 12.8983, lng: 77.5202 },
};

export const EDGES = {
  gate: [{ to: "node1", w: 1 }],
  node1: [
    { to: "gate", w: 1 },
    { to: "node2", w: 1 },
    { to: "lib",  w: 1 },
  ],
  node2: [
    { to: "node1", w: 1 },
    { to: "cse",   w: 1 },
    { to: "adm",   w: 1 },
    { to: "caf",   w: 1 },
  ],
  lib: [{ to: "node1", w: 1 }],
  cse: [{ to: "node2", w: 1 }],
  adm: [{ to: "node2", w: 1 }],
  caf: [{ to: "node2", w: 1 }],
};
