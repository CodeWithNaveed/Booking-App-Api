import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

// ager Network Access mai i.d delete hojay to disconnect hojay ga per dubara mongodb mai ja kr bnani pre gi
mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
})


//middlewares
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://booking-app-client-beta.vercel.app",
        "https://booking-app-admin-chi.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// "https://booking-app-admin-chi.vercel.app/login"

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);


app.get("/", (req, res) => {
    res.send("Hello from the server of Booking App!");
})

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

const port = 4400;
app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});