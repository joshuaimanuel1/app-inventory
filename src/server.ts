import dotenv from "dotenv";
import app from "./app";

// Load environment variables
dotenv.config();

// Define port with proper typing
const PORT: number = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
