import express from "express";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
