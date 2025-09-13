import Express from "express";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes"
import credentialRouter from "./routes/credential.routes"

const app = Express();
const PORT = process.env.PORT ?? 8000;


app.use(cookieParser());
app.use(Express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/credential", credentialRouter);

app.listen(PORT, () => {
  console.log("Server is running on port : " + PORT)
})
