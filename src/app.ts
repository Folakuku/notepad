import { startApp } from "./server";
import express, { Application } from "express";

export const app: Application = express();
startApp(app);
