const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { PassThrough } = require('stream');
const SurveillanceEvent = require('../models/surveillance');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let frameBuffers = [];

// Call this on every incoming WebSocket frame from ESP32-CAM
const handleIncomingFrame = (frameData) => {
  // Retain last ~225 frames (~15 seconds at 15 FPS)
  if (frameBuffers.length > 225) {
    frameBuffers.shift();
  }

  const buffer = Buffer.isBuffer(frameData)
    ? frameData
    : Buffer.from(frameData.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

  frameBuffers.push(buffer);
};

const uploadToCloudinary = (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'surveillance_events',
        public_id: `hazard_${Date.now()}`,
        format: 'mp4',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(videoBuffer).pipe(uploadStream);
  });
};

const saveHazardClip = async (eventType, hazardLabel) => {
  try {
    if (frameBuffers.length === 0) return;

    const framesToProcess = [...frameBuffers];
    const passThroughStream = new PassThrough();
    const chunks = [];

    passThroughStream.on('data', (chunk) => chunks.push(chunk));

    const command = ffmpeg();
    let frameIdx = 0;

    const writeFrames = () => {
      if (frameIdx < framesToProcess.length) {
        const canContinue = command.ffmpegProc.stdin.write(framesToProcess[frameIdx]);
        frameIdx++;
        if (canContinue) {
          writeFrames();
        } else {
          command.ffmpegProc.stdin.once('drain', writeFrames);
        }
      } else {
        command.ffmpegProc.stdin.end();
      }
    };

    command
      .input('pipe:0')
      .inputFormat('singlejpeg')
      .inputFPS(15)
      .outputFormat('mp4')
      .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-movflags frag_keyframe+empty_moov'])
      .on('start', () => writeFrames())
      .on('error', (err) => console.error('FFmpeg error:', err))
      .on('end', async () => {
        const fullVideoBuffer = Buffer.concat(chunks);
        const cloudResult = await uploadToCloudinary(fullVideoBuffer);

        const newEvent = await SurveillanceEvent.create({
          eventType: eventType || 'HAZARD_ALERT',
          hazardLabel: hazardLabel || 'Flame Detected',
          videoUrl: cloudResult.secure_url,
          cloudinaryPublicId: cloudResult.public_id,
          durationSeconds: Math.round(cloudResult.duration || framesToProcess.length / 15),
        });

        console.log('Recorded clip saved to Cloudinary & MongoDB:', newEvent._id);
      })
      .pipe(passThroughStream, { end: true });
  } catch (err) {
    console.error('Error saving clip:', err);
  }
};

module.exports = { handleIncomingFrame, saveHazardClip };