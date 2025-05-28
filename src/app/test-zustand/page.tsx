'use client'
import { useDetectionStore } from '../lib/store';

export default function TestZustand() {
  const detectionResults = useDetectionStore((state) => state.detectionResults);
  const addDetectionResult = useDetectionStore((state) => state.addDetectionResult);

  return (
    <div style={{ padding: 32 }}>
      <button
        style={{ padding: 8, background: 'green', color: 'white', borderRadius: 4 }}
        onClick={() =>
          addDetectionResult({
            detection_time: new Date().toISOString(),
            frame_number: 1,
            license_plate: {
              gcs_url: '',
              id: 1,
              image_path: '',
              number: 'TEST',
              signed_url: '',
            },
            success: true,
            vehicle: {
              color: null,
              gcs_url: '',
              id: 1,
              image_path: '',
              plate_number: 'TEST',
              signed_url: '',
            },
          })
        }
      >
        Add Detection
      </button>
      <pre style={{ color: 'red', background: '#222', padding: 8, margin: 8, borderRadius: 4 }}>
        {JSON.stringify(detectionResults, null, 2)}
      </pre>
    </div>
  );
} 