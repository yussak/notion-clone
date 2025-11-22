import express from 'express';
import cors from "cors";
import pagesRouter from './routes/pageRoutes';

const app = express();
const PORT = 8080;

// TODO: cors設定
app.use(cors());
app.use(express.json());

app.use('/api', pagesRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});