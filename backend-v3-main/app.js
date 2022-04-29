//Constants
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');

//errorHandler
const errorHandler = require('./helpers/error-handler');

//Cors
app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const W_productsRoutes = require('./routes/w-products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const variantsRoutes = require('./routes/products-variants');
const W_variantsRoutes = require('./routes/w-products-variants')
const brandsRoutes = require('./routes/brands');


const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/women-products`, W_productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/variants`, variantsRoutes);
app.use(`${api}/w-variants`, W_variantsRoutes)
app.use(`${api}/brands`, brandsRoutes);



//Database connection
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Database connection ready...');
}).catch((err) => {
    console.log(err);
})

//Server
app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');

})

