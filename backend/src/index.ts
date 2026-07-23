import express from 'express';
import cors from 'cors';
import barangRoutes from './routes/barang.routes';
import kategoriRoutes from './routes/kategori.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running.' });
});

app.use('/api/barang', barangRoutes);
app.use('/api/kategori', kategoriRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Master Barang API listening on http://localhost:${PORT}`);
});

export default app;
