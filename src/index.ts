import express from 'express';
import { json } from 'body-parser';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors'; 
import { isLogin } from './middlewares/islogin';
import AppDataSource from './data-source';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running!");
  });

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Error during Data Source initialization:", error);
});
