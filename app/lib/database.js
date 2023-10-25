function initializeDatabase(db) {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        prompt TEXT NOT NULL
      );`);
  });
}

module.exports = {
  initializeDatabase,
};
