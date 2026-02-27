const fs = require("fs").promises;
const path = require("path");
const dbPath = path.join(__dirname, "..", "data/data.json");

const getData = async () => {
  try {
    const data = await fs.readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getData,
};
