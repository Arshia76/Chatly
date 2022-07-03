const MessageModel = require('../models/Message');
const fs = require('fs');

const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    return fs.mkdirSync(dir, { recursive: true });
  }
};

const MessageFileUploadController = async (req, res) => {
  if (req.files) {
    console.log(req.files);
    console.log(req.body);
    let file = req.files.file;
    let filename = Date.now() + file.name;
    console.log(filename);

    const path = `${require('path').resolve(__dirname, '..')}/uploads/${
      req.body.chat
    }/images/${req.body.user}`;

    createDirectory(path);

    file.mv(`${path}/${filename}`, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'خطا در بارگزاری',
          error: err,
        });
      } else {
        console.log('File Uploaded');
        const dataPath =
          `/uploads/${req.body.chat}/images/${req.body.user}` + '/' + filename;
        return res.status(200).send(dataPath);
      }
    });
  }
};

const AudioFileUploadController = (req, res) => {
  if (req.files) {
    console.log(req.files);
    let file = req.files.file;
    let filename = Date.now() + file.name;
    console.log(filename);

    const path = `${require('path').resolve(__dirname, '..')}/uploads/${
      req.body.chat
    }/sounds/${req.body.user}`;

    createDirectory(path);

    file.mv(`${path}/${filename}.wav`, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'خطا در بارگزاری',
          error: err,
        });
      } else {
        console.log(Buffer.from(new Uint8Array(req.files.file.data)));
        fs.writeFileSync(
          `${require('path').resolve(__dirname, '..')}/uploads/${
            req.body.chat
          }/sounds/${req.body.user}/${filename}.wav`,
          Buffer.from(new Uint8Array(req.files.file.data))
        );
        console.log('File Uploaded');
        const dataPath =
          `/uploads/${req.body.chat}/sounds/${req.body.user}` +
          '/' +
          filename +
          '.wav';
        return res.status(200).send(dataPath);
      }
    });
  }
};

const DocumentFileUploadController = (req, res) => {
  if (req.files) {
    console.log(req.files);
    let file = req.files.file;
    let filename = Date.now() + file.name;
    console.log(filename);

    const path = `${require('path').resolve(__dirname, '..')}/uploads/${
      req.body.chat
    }/documents/${req.body.user}`;

    createDirectory(path);

    file.mv(`${path}/${filename}`, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'خطا در بارگزاری',
          error: err,
        });
      } else {
        console.log('File Uploaded');
        const dataPath =
          `/uploads/${req.body.chat}/documents/${req.body.user}` +
          '/' +
          filename;
        return res.status(200).send(dataPath);
      }
    });
  }
};

const DownloadDocumentController = async (req, res) => {
  try {
    if (!req.body.file) {
      return res.status(400).json({
        success: false,
        message: 'لطفا فایل را انتخاب کنید',
      });
    }

    const path = `${require('path').resolve(__dirname, '..')}${
      process.env.NODE_ENV === 'development'
        ? req.body.file.split('5000')[1]
        : req.body.file.split('.com')[1]
    }`;

    return res.status(200).download(path);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

module.exports = {
  MessageFileUploadController,
  AudioFileUploadController,
  DocumentFileUploadController,
  DownloadDocumentController,
};
