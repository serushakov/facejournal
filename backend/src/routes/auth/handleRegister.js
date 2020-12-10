import { Op } from 'sequelize';
import * as fs from 'fs';
import path from 'path';
import multer from 'multer';
import mime from 'mime-types';
import { body, validationResult } from 'express-validator';
import { User } from '../../database';
import { createUser, createUserJwt } from './utils';

const storageRoot = path.join(
  path.dirname(require.main.filename),
  '../',
  'static',
  'user-images'
);

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const storage = multer.diskStorage({
  destination: storageRoot,
  filename: async (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    if (!fs.existsSync(storageRoot)) {
      await fs.promises.mkdir(storageRoot);
    }

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${mime.extension(file.mimetype)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type ${file.mimetype}`));
    }
  },
});

export const uploadHandler = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]);

export const registerValidators = [
  body('email').isEmail().exists(),
  body('password').exists(),
  body('firstName').exists(),
  body('lastName').exists(),
];

async function handleRegister(req, res) {
  const { files } = req;
  const { email, password, firstName, lastName } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  const existingUser = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  const avatarUrl = `/static/user-images/${files.avatar[0].filename}`;
  const bgUrl = `/static/user-images/${files.background[0].filename}`;

  const user = await createUser({
    email,
    password,
    firstName,
    lastName,
    avatar: avatarUrl,
    coverImage: bgUrl,
  });
  const token = createUserJwt(user);

  res.send({
    user: {
      ...(await user.toJSON()),

      followerCount: 0,
      subscriptions: [],
    },
    token,
  });
}

export default handleRegister;
