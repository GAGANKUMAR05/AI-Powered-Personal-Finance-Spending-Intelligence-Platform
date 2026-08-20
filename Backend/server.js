import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

async function startServer() {
    await connectToDb();

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

startServer();