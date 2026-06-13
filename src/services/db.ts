// FIX: Replaced real DB connection with a Mock version to prevent browser crash
export const initDb = async () => {
  console.log('Mock Database initialized for browser demo.');
  return Promise.resolve();
};

const pool = {
  connect: () => {
    console.error("Attempted to connect to Postgres from Browser. Using Mock Data instead.");
    throw new Error("Cannot connect to Postgres from Browser. Use Mock Data.");
  }
};

export default pool;