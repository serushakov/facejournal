import express from 'express';
import path from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import auth from './routes/auth';
import posts from './routes/posts';
import users from './routes/users';

import './passport';
import { Friendship, User } from './database';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, '../', 'static')));
app.use(passport.initialize());

app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', posts);

app.get('/', (req, res) => {
  res.send('Hello world');
});

/* AUTHENTICATED ROUTES BELOW */
app.use(passport.authenticate('jwt'));

app.get('/users', async (req, res) => {
  const users = await User.findAll({
    attributes: ['firstName', 'lastName', 'id', 'email'],
    include: {
      model: User,
      as: 'friends',
      attributes: ['firstName', 'lastName', 'id', 'email'],
    },
  });

  res.json(users);
});

app.post('/friend', async (req, res) => {
  if (!req.isAuthenticated()) return res.send(401);

  const userId = req.body.userId;

  if (!userId) {
    return res.send(400);
  }

  Friendship.create({
    friendId: userId,
    UserId: req.user.id,
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
