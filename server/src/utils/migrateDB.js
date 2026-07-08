import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const LOCAL_URI = 'mongodb://localhost:27017/aurelia-jewels';
const ATLAS_URI = process.env.MONGODB_URI;

const migrate = async () => {
  if (!ATLAS_URI || ATLAS_URI.includes('localhost')) {
    console.error('Set MONGODB_URI in .env to your Atlas connection string first');
    process.exit(1);
  }

  console.log('Connecting to local DB...');
  const local = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Connected to local DB');

  const collections = await local.db.listCollections().toArray();
  if (!collections.length) {
    console.log('No collections found in local DB — nothing to migrate');
    await local.close();
    return;
  }

  const names = collections.map((c) => c.name);
  console.log(`Found collections: ${names.join(', ')}`);

  console.log('Connecting to Atlas...');
  const atlas = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('Connected to Atlas');

  for (const name of names) {
    console.log(`\nMigrating ${name}...`);
    const docs = await local.db.collection(name).find({}).toArray();
    if (!docs.length) {
      console.log(`  (empty, skipping)`);
      continue;
    }

    await atlas.db.collection(name).deleteMany({});
    await atlas.db.collection(name).insertMany(docs);
    console.log(`  ${docs.length} documents inserted`);
  }

  await local.close();
  await atlas.close();
  console.log('\nMigration complete');
};

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
