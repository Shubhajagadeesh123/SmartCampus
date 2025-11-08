// src/data/colleges-blr.js
export const COLLEGES_BL = [
  { id: "jssateb", name: "JSS Academy of Technical Education, Bengaluru", lat: 12.8618, lng: 77.5859, area: "Uttarahalli" },
  { id: "rvce",    name: "RV College of Engineering",                    lat: 12.9237, lng: 77.4995, area: "Mysuru Rd" },
  { id: "bmsce",   name: "BMS College of Engineering",                    lat: 12.9416, lng: 77.5650, area: "Basavanagudi" },
  { id: "msrit",   name: "M S Ramaiah Institute of Technology",           lat: 13.0315, lng: 77.5655, area: "MSR Nagar" },
  { id: "pesu",    name: "PES University (Ring Road Campus)",             lat: 12.9344, lng: 77.5342, area: "Banashankari" },
  { id: "bit",     name: "Bangalore Institute of Technology",             lat: 12.9535, lng: 77.5735, area: "KR Rd" },
  { id: "sirmvit", name: "Sir MVIT",                                      lat: 13.1986, lng: 77.7067, area: "Yelahanka" },
  { id: "sjce",    name: "SJCE (JSS Science & Tech Univ) Bengaluru Ctr",  lat: 12.9716, lng: 77.5946, area: "Central Bengaluru" },
  { id: "dayananda", name: "Dayananda Sagar College of Engineering",      lat: 12.9062, lng: 77.5644, area: "Kumaraswamy Lyt" },
  { id: "cmrit",   name: "CMR Institute of Technology",                   lat: 12.9699, lng: 77.6974, area: "AECS Layout" },
  { id: "reva",    name: "REVA University",                               lat: 13.1282, lng: 77.6369, area: "Kattigenahalli" },
  { id: "dsatm",   name: "Dayananda Sagar Academy of Tech & Mgmt",        lat: 12.7841, lng: 77.5769, area: "Kanakapura Rd" },
  { id: "rnsit",   name: "RNS Institute of Technology",                    lat: 12.9016, lng: 77.5207, area: "Channasandra" },
  { id: "bnmit",   name: "BNM Institute of Technology",                   lat: 12.9088, lng: 77.5668, area: "Banashankari" },
  { id: "acharya", name: "Acharya Institute of Technology",               lat: 13.0806, lng: 77.4883, area: "Soladevanahalli" },
  { id: "eastwest",name: "East West Institute of Technology",             lat: 12.9716, lng: 77.4557, area: "Magadi Rd" },
  { id: "newhorizon", name: "New Horizon College of Engineering",         lat: 12.9363, lng: 77.6905, area: "Marathahalli" },
  { id: "bmsit",   name: "BMS Institute of Technology & Mgmt",            lat: 13.1335, lng: 77.5688, area: "Yelahanka" },
];

export const COLLEGE_BY_ID = Object.fromEntries(COLLEGES_BL.map(c => [c.id, c]));
