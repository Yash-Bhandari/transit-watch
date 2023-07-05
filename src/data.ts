interface TransitStation {
  name: string;
  location?: [number, number]; // [lat, lng]
}

export const TRANSIT_STATIONS = [
  { name: "Century Park" },
  { name: "South Campus/Fort Edmonton Park" },
  { name: "Southgate" },
  { name: "McKernan/Belgravia" },
  { name: "University" },
  { name: "Health Sciences/Jubilee" },
  { name: "Corona" },
  { name: "Grandin/Government Centre" },
  { name: "Bay/Enterprise Square" },
  { name: "Central" },
  { name: "Churchill" },
  { name: "Kingsway/Royal Alex" },
  { name: "NAIT" },
  { name: "MacEwan" },
  { name: "Stadium" },
  { name: "Coliseum" },
  { name: "Belvedere" },
  { name: "Clareview" },
].sort((a, b) => a.name.localeCompare(b.name));

export const DESINATION_STATIONS = [
  { name: "Century Park" },
  { name: "Claireview" },
  { name: "Health Sciences/Jubilee" },
  { name: "NAIT" },
];

export const CAPITAL_LINE_STATIONS = [
  "Clareview",
  "Belvedere",
  "Coliseum",
  "Stadium",
  "Churchill",
  "Central",
  "Bay/Enterprise Square",
  "Corona",
  "Government Centre",
  "University",
  "Health Sciences/Jubilee",
  "McKernan/Belgravia",
  "Southgate",
  "South Campus/Fort Edmonton Park",
  "Century Park",
];

export const METRO_LINE_STATIONS = [
  "Health Sciences/Jubilee",
  "Government Centre",
  "Corona",
  "Bay/Enterprise Square",
  "Central",
  "Churchill",
  "MacEwan",
  "Kingsway/Royal Alex",
  "NAIT",
];
