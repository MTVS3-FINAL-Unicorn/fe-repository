import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopicAnalysis = ({ topicData }) => {
  if (!topicData || !topicData.tinfo || !topicData.mdsDat) {
    return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  }

  const topicBarData = {
    labels: topicData.tinfo.Term.slice(0, 10),
    datasets: [
      {
        label: '빈도',
        data: topicData.tinfo.Freq.slice(0, 10),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to stretch vertically
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Find the label of the most frequent topic
  const mostFrequentTopicIndex = topicData.mdsDat.Freq.indexOf(Math.max(...topicData.mdsDat.Freq));
  const mostFrequentTopic = {
    label: topicData.tinfo.Term[mostFrequentTopicIndex],
    frequency: topicData.mdsDat.Freq[mostFrequentTopicIndex],
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>토픽 분석</h2>
      <div style={styles.chartContainer}>
        <Bar data={topicBarData} options={options} />
      </div>
      <p style={styles.description}>주요 토픽과 그 빈도를 시각화한 차트입니다.</p>
      <p style={styles.highlight}>
        <strong>가장 빈도가 높은 주제:</strong> {mostFrequentTopic.label} (빈도: {mostFrequentTopic.frequency.toFixed(2)}%)
      </p>
    </section>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  chartContainer: {
    width: '800px',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    marginTop: '20px',
  },
  highlight: {
    fontSize: '18px',
    color: '#333',
    marginTop: '10px',
  },
};

export default TopicAnalysis;
