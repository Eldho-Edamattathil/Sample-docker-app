const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");
const cors=require("cors")
const app = express();
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");

const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(() => console.log("Connected to database"))
    .catch((e) => console.log(e));

// Initialize Redis client
let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((e) => console.log("Error connecting to Redis:", e));

app.use(express.json());

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60000
    }
}));



app.use("/posts", postRouter);
app.use("/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
