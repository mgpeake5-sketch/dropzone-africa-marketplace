
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api/routes-improved';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://dropzone-africa.com', 
        'https://www.dropzone-africa.com',
        'https://dropzone-africa-marketplace.vercel.app',
        'https://mgpeake5-sketch-dropzone-africa-marketplace.vercel.app'
      ] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('DROPZONE AFRICA API is running!');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
