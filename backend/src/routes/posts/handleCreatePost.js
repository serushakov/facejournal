import multer from 'multer';
import * as fs from 'fs';
import path from 'path';
import { body, validationResult } from 'express-validator';
import mime from 'mime-types';
import { Post } from '../../database';

const allowedMimeTypes = [
  'video/mp4',
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
      cb(new Error('Unsupported file type'));
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
  body('title').isLength({ min: 3, max: 200 }),
  body('text_content').isLength({ max: 3000 }),
];

export const uploadHandler = upload.single('media');

async function handleCreatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { user, body: requestBody, file } = req;
  const { title, text_content: textContent } = requestBody;

  if (!user) {
    return res.status(500);
  }

  const fileType = file && getFileType(file.mimetype);
  const filePath = file && `/static/${file.filename}`;

  const fileFields = {};

  switch (fileType) {
    case 'image':
      fileFields.imageUrls = [filePath];
      break;
    case 'video':
      fileFields.videoUrl = filePath;
      break;
    default:
  }

  const post = await Post.create({
    title,
    textContent,
    creator: user.id,
    ...fileFields,
  });

  res.status(201);

  res.send(post);
}

export default handleCreatePost;
