const express = require('express');
const cors = require("cors");
const app = express();
const videosRoutes = require('./routes/videosRoutes');
const PORT = 8081;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/videos', videosRoutes);


//start server
app.listen(PORT, function () {
    console.log(`Server running at http://localhost:${PORT}`)
});