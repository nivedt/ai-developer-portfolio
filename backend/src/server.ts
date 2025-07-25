import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);

    if(process.env.NODE_ENV === 'development') {
        console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
        console.log(`Database Studio: Run 'npx prisma studio' in backend directory`);
    }
})
