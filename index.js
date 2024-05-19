
const express = require('express');
const roots = require('./roots');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');




const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

roots(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);  

    