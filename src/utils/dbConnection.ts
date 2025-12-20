import logger from "@/helper_functions/logger";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URI || "";

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = {
    conn: null,
    promise: null,
  };
}
if (!mongoUrl) logger.log("URL not present..");

export const dbConnection = async () => {
  try {
    if (cache.conn) return cache.conn;

    if (!cache.promise) {
      cache.promise = mongoose
        .connect(mongoUrl)
        .then((conn) => conn.connection);
    }
    const conn = await cache.promise;
    logger.log("DB Connected successfully..");
    return conn;
  } catch (Err) {
    logger.error("ERROR OCCURED WHILE CONNECTING WITH DB..");
  }
};

export default dbConnection;
