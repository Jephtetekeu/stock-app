import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockEvolutionGraph = ({ itemId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get(`/api/items/${itemId}/history`, config);
        const history = res.data;

        // Sort history by date to ensure correct graph display
        history.sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData({
          labels: history.map((data) => new Date(data.date).toLocaleDateString()),
          datasets: [
            {
              label: 'Stock Quantity',
              data: history.map((data) => data.quantity),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        console.error(err.response.data);
      }
    };

    if (itemId) {
      fetchStockHistory();
    }
  }, [itemId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Evolution Over Time',
      },
    },
  };

  return (
    <div style={{ width: '600px', height: '300px' }}>
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No stock history available for this item.</p>
      )}
    </div>
  );
};

export default StockEvolutionGraph;
