import express from "express";
import cors from "cors";


import { requestLogger, errorHandler } from "./middleware/errorHandler.js";

import adminRoutes from "./routes/adminRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import diagnoseRoutes from "./routes/diagnoseRoutes.js";
import translationRoutes from "./routes/translationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 
app.use(requestLogger); 


app.use("/api/admin", adminRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/diagnose", diagnoseRoutes);
app.use("/api/translate", translationRoutes);


app.get("/health", (req, res) => {
  res.json({ success: true, message: "Expert System API is running smoothly." });
});


app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Kenya Crop Disease API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});