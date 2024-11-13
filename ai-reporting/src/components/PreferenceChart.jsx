import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getPreferenceAnswers } from '../utils/api'; // Import the API function
import '../css/ResultsPage.css'; // Ensure this CSS file includes relevant styling for chart size

const PreferenceChart = ({ questionId }) => {
  const [preferenceData, setPreferenceData] = useState(null);

  useEffect(() => {
    const fetchPreferenceData = async () => {
      try {
        const answers = await getPreferenceAnswers(questionId);

        // Count occurrences of each choice in `content`
        const counts = answers.reduce((acc, answer) => {
          acc[answer.content] = (acc[answer.content] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for the Bar chart
        const data = {
          labels: Object.keys(counts),
          datasets: [
            {
              label: '선택한 인원 수',
              data: Object.values(counts),
              backgroundColor: 'rgba(255, 159, 64, 0.6)', // Set a unique color different from frequency analysis
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        };

        setPreferenceData(data);
      } catch (error) {
        console.error('Error fetching preference data:', error);
      }
    };

    fetchPreferenceData();
  }, [questionId]);

  if (!preferenceData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <section className="preference-chart">
      <h2>선택 항목 분석</h2>
      <div className="chart-container">
        <Bar data={preferenceData} options={options} />
      </div>
      <p>
        {Object.values(preferenceData.datasets[0].data).reduce((a, b) => a + b, 0)}명의 사용자가{' '}
        {preferenceData.labels.length}번의 선택지를 선택했습니다.
      </p>
    </section>
  );
};

export default PreferenceChart;
