import mongoose from 'mongoose';
import { dbURL } from '../../credentials.json';

// Connect to database
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));

