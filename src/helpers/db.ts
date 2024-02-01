import { connect } from "mongoose";
const dbUri = process.env.MONGO_URI;

export default async () => {
  return new Promise((resolve, reject) => {
    connect(dbUri)
      .then(() => {
        resolve(console.log("Database Connected"));
      })
      .catch((error: Error) => {
        reject(console.log("Database Connection Error: ", error));
      });
  });
};
