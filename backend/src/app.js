import express from 'express';
import path from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import auth from './routes/auth';
import posts from './routes/posts';
import users from './routes/users';
import config from './routes/config';
import './passport';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, '../', 'static')));
app.use(passport.initialize());

app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', posts);
app.use('/config', config);

app.get('/', (req, res) => {
  res.send('Hello world');
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
