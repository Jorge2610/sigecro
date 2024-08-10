const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const routes = require('./routes');

require('dotenv').config(); 

// Configuraciones
app.disable("x-powered-by");

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:3000'], 
  methods: 'GET,POST,PUT,DELETE,PATCH', 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rutas
app.use('/api/', routes);

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});