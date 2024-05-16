const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./db');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const favicon = require('serve-favicon'); // Import serve-favicon module

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Path to your favicon
const faviconPath = path.join(__dirname, 'globalcyber.ico'); // Replace 'path_to_your_favicon.ico' with the path to your favicon

// Middleware to serve favicon
app.use(favicon(faviconPath));

// End!!
app.use(errorHandler);

app.get('/', (req, res) => {
    try {
        res.status(200).json({ message: "Успешно!" });
    } catch (error) {
        console.error("Произошла ошибка:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
