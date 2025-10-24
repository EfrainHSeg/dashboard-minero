import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js'; 

const app = express();
const PORT = process.env.PORT || 3001; 

// ===================================
// Middlewares (GLOBALES)
// ===================================


app.use(cors()); 
app.use(express.json());

// ===================================
// Rutas
// ===================================

// Ruta de prueba simple para verificar que el servidor está activo
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/users', usersRouter);

// ===================================
// Manejador de Errores (Error Handler)
// ===================================


app.use((err, req, res, next) => {
    console.error('SERVER ERROR STACK:', err.stack);
    
    const errorMessage = process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error';

    res.status(err.status || 500).json({ 
        success: false, 
        message: 'Internal server error',
        error: errorMessage
    });
});

// ===================================
// Inicio del Servidor
// ===================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});