const express = require('express');
const {
  MessageFileUploadController,
  AudioFileUploadController,
  DocumentFileUploadController,
  DownloadDocumentController,
  AvatarUploadController,
} = require('../controllers/file');
const { authorize } = require('../middleware/authorize');
const router = express();

router.post('/upload/avatar', AvatarUploadController);

router.post('/upload/message', authorize, MessageFileUploadController);

router.post('/upload/audio', authorize, AudioFileUploadController);

router.post('/upload/document', authorize, DocumentFileUploadController);

router.post('/download', authorize, DownloadDocumentController);

module.exports = router;
