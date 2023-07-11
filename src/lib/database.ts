import Loki from "lokijs";

if (!globalThis.db) {
  const db = new Loki("data.json", {
    autosave: true,
    autoload: true,
    autosaveInterval: 1000 * 60 * 5,
  });
  console.log('----------- Creating new db ------------')
  db.addCollection("reports");
  globalThis.db = db;
}

export default globalThis.db;

