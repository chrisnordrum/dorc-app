const fs = require("fs").promises;
const path = require("path");
const dbPath = path.join(__dirname, "..", "data/data.json");

/**
 * Model: Get data from the database
 *
 * Reads the data.json file and returns the data as a JSON object.
 *
 * @returns {Object} - JSON object containing the data
 */
const getData = async () => {
  try {
    const data = await fs.readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Model: Save data to the database
 *
 * Saves the data to the data.json file.
 *
 * @param {Object} db - JSON object containing the data from the frontend.
 */
const saveData = async (db) => {
  try {
    //convert the JSON object to a string
    const data = JSON.stringify(db, null, "  ");
    //write the data to the data.json file
    await fs.writeFile(dbPath, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getData,
  saveData,
};
