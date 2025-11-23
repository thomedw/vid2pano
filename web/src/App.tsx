import { useState, useRef } from 'react';
import { usePanoramaStitcher } from './hooks/usePanoramaStitcher';

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [panoramaUrl, setPanoramaUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { ready, error, addFrame, stitch, clear, frameCount } =
    usePanoramaStitcher();

  const extractFrames = async () => {
    if (!videoRef.current || !canvasRef.current || !videoFile) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const extractedFrames: ImageData[] = [];
    const duration = video.duration;
    const frameInterval = duration / 10; // Extract 10 frames

    clear();
    setFrames([]);

    for (let i = 0; i < 10; i++) {
      const time = i * frameInterval;
      await new Promise<void>((resolve) => {
        video.currentTime = time;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          extractedFrames.push(imageData);
          addFrame(imageData);
          resolve();
        };
      });
    }

    setFrames(extractedFrames);
  };

  const handleStitch = () => {
    setProcessing(true);
    try {
      const result = stitch();
      if (result) {
        const blob = new Blob([result], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setPanoramaUrl(url);
      }
    } catch (err) {
      console.error('Stitching failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>vid2pano - Panoramic Video Stitcher</h1>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</div>}
      {!ready && <div style={{ marginTop: '1rem' }}>Loading WASM module...</div>}

      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={!ready}
        />
      </div>

      {videoFile && (
        <>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', maxWidth: '800px', marginBottom: '1rem' }}
          />

          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={extractFrames}
              disabled={!ready || processing}
              style={{ 
                marginRight: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: ready && !processing ? 'pointer' : 'not-allowed',
                backgroundColor: ready && !processing ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Extract Frames ({frameCount()} frames)
            </button>
            <button
              onClick={handleStitch}
              disabled={!ready || processing || frameCount() === 0}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: ready && !processing && frameCount() > 0 ? 'pointer' : 'not-allowed',
                backgroundColor: ready && !processing && frameCount() > 0 ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {processing ? 'Stitching...' : 'Stitch Panorama'}
            </button>
          </div>
        </>
      )}

      {panoramaUrl && (
        <div>
          <h2>Result:</h2>
          <img
            src={panoramaUrl}
            alt="Panorama"
            style={{ maxWidth: '100%', border: '1px solid #ccc', marginTop: '1rem' }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;

