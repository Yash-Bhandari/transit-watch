import Loki from "lokijs";

const db = new Loki("data.json", {
  autosave: true,
  autoload: true,
  autosaveInterval: 1000 * 60 * 5,
});

export default db;
