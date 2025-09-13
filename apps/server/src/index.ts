import Express from "express";
import userRouter from "./routes/user.routes"
import cookieParser from "cookie-parser"

const app = Express();
const PORT = process.env.PORT ?? 8000;


app.use(cookieParser());
app.use(Express.json());

app.use("/api/v1/user/", userRouter);


app.listen(PORT, () => {
  console.log("Server is running on port : " + PORT)
})
