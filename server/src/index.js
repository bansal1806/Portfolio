import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGODB_URI);

createApp().listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`);
});
