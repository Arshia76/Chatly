const express = require('express');
const {
  MessageFileUploadController,
  AudioFileUploadController,
  DocumentFileUploadController,
  DownloadDocumentController,
} = require('../controllers/file');
const router = express();

router.post('/upload/message', MessageFileUploadController);

router.post('/upload/audio', AudioFileUploadController);

router.post('/upload/document', DocumentFileUploadController);

router.post('/download', DownloadDocumentController);

module.exports = router;
