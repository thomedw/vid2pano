import { useState, useEffect, useCallback } from 'react';
import init, { PanoramaStitcher } from '../../../pkg/vid2pano';

export const usePanoramaStitcher = () => {
  const [stitcher, setStitcher] = useState<PanoramaStitcher | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init()
      .then(() => {
        const s = new PanoramaStitcher();
        setStitcher(s);
        setReady(true);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to initialize WASM:', err);
      });
  }, []);

  const addFrame = useCallback(
    (imageData: ImageData) => {
      if (!stitcher) {
        throw new Error('Stitcher not initialized');
      }
      // Convert Uint8ClampedArray to Uint8Array
      const data = new Uint8Array(imageData.data);
      stitcher.add_frame(
        data,
        imageData.width,
        imageData.height
      );
    },
    [stitcher]
  );

  const stitch = useCallback((): Uint8Array | null => {
    if (!stitcher) {
      return null;
    }
    const result = stitcher.stitch();
    return result.length > 0 ? new Uint8Array(result) : null;
  }, [stitcher]);

  const clear = useCallback(() => {
    stitcher?.clear();
  }, [stitcher]);

  const frameCount = useCallback((): number => {
    return stitcher?.frame_count() || 0;
  }, [stitcher]);

  return {
    ready,
    error,
    addFrame,
    stitch,
    clear,
    frameCount,
  };
};

