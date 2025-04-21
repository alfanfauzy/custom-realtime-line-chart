import { useState, useEffect } from 'react';
import RealtimeChart from './RealTimeChart';

const STATUS = ['low', 'medium', 'high'];

const App = () => {
  const [data, setData] = useState<Array<{ time: string; y: string }>>([]);

  useEffect(() => {
    // Start with 10 initial data points
    const initialData = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(Date.now() - (10 - i) * 2000).toISOString(),
      y: STATUS[Math.floor(Math.random() * STATUS.length)],
    }));

    setData(initialData);

    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toISOString(),
        y: STATUS[Math.floor(Math.random() * STATUS.length)],
      };
      setData((prev) => [...prev, newPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg w-2xl">
      <h2 className="text-xl font-bold mb-4">Realtime Status Chart</h2>
      <RealtimeChart data={data} width={900} height={200} />
      <div className="mt-4 text-sm text-gray-400">
        <p>• New data points added every 2 seconds</p>
        <p>• Current data points: {data.length}</p>
        <p>
          • Last status: {data.length > 0 ? data[data.length - 1].y : 'none'}
        </p>
      </div>
    </div>
  );
};

export default App;
