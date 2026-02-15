import express from "express";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());

// Route for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});