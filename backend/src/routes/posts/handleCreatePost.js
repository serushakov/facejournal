import multer from 'multer';
import * as fs from 'fs';
import path from 'path';
import { body, validationResult } from 'express-validator';
import mime from 'mime-types';
import { Post, Media } from '../../database';

const allowedMimeTypes = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'image/jpeg',
  'image/gif',
  'image/png',
];

const storageRoot = path.join(
  path.dirname(require.main.filename),
  '../',
  'static'
);

const storage = multer.diskStorage({
  destination: storageRoot,
  filename: async (req, file, cb) => {
    const userId = req.user.id;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const folderPath = path.join(storageRoot, userId);

    if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(path.join(storageRoot, userId));
    }

    cb(
      null,
      `${userId}/${file.fieldname}-${uniqueSuffix}.${mime.extension(
        file.mimetype
      )}`
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

const getFileType = (mimetype) => {
  if (!mimetype) return null;
  if (mimetype.includes('video')) {
    return 'video';
  }
  if (mimetype.includes('image')) {
    return 'image';
  }
};

export const createPostValidators = [
  body('title').isLength({ min: 1, max: 200 }),
  body('text_content').isLength({ max: 3000 }),
];

export const uploadHandler = upload.array('media', 5);

async function handleCreatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { user, body: requestBody, files } = req;
  const { title, text_content: textContent } = requestBody;

  if (!user) {
    return res.status(500);
  }

  const post = await Post.create({
    title,
    textContent,
  });

  post.setCreator(user);

  const media =
    files &&
    (await Promise.all(
      files.map((file) =>
        Media.create({
          url: `/static/${file.filename}`,
          type: getFileType(file.mimetype),
        })
      )
    ));

  post.addMedia(media);

  res.status(201);

  res.send(post);
}

export default handleCreatePost;
