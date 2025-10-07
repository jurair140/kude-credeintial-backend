import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { router } from './routes';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Backend API running at http://localhost:${port}`);
});
