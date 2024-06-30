const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'client/public' folder (where Svelte outputs files)
app.use(express.static(path.join(__dirname, '../client/static' )));

// Define API routes or any other backend logic here

// Serve the Svelte application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src', 'app.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
