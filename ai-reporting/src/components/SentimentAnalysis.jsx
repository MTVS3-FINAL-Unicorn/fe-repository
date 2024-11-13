import React from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const SentimentAnalysis = ({ sentimentData }) => {
  if (!sentimentData || Object.keys(sentimentData).length === 0) {
    return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  }

  // Sort terms by frequency and take the top 10 for legend and highlight purposes
  const sortedTerms = Object.entries(sentimentData)
    .sort(([, a], [, b]) => b.freq - a.freq)
    .slice(0, 10);

  const topTerms = new Set(sortedTerms.map(([term]) => term));

  const sentimentBubbleData = {
    datasets: Object.keys(sentimentData).map((term, index) => ({
      label: topTerms.has(term) ? term : '', // Only show labels for top 10 terms
      data: [
        {
          x: sentimentData[term].freq,
          y: sentimentData[term].sentiment_score,
          r: Math.sqrt(sentimentData[term].freq) * 5,
        },
      ],
      backgroundColor: topTerms.has(term)
        ? `rgba(${index * 25 % 255}, ${150 + index * 10 % 100}, ${200 - index * 15 % 150}, 0.7)`
        : 'rgba(200, 200, 200, 0.4)', // gray for non-top terms
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      hoverBorderColor: topTerms.has(term) ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
      hoverBorderWidth: topTerms.has(term) ? 2 : 1,
    })),
  };

  const mostPositiveTerm = Object.entries(sentimentData).reduce(
    (max, [term, data]) =>
      data.sentiment_score > max.sentiment_score ? { term, ...data } : max,
    { term: '', sentiment_score: -1 }
  );

  const mostNegativeTerm = Object.entries(sentimentData).reduce(
    (min, [term, data]) =>
      data.sentiment_score < min.sentiment_score ? { term, ...data } : min,
    { term: '', sentiment_score: 1 }
  );

  const options = {
    scales: {
      x: {
        title: { display: true, text: '빈도 (Frequency)' },
        beginAtZero: true,
      },
      y: {
        title: { display: true, text: '감정 점수 (Sentiment Score)' },
        min: 0,
        max: 1,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legendItem) => topTerms.has(legendItem.text), // Only show legend for top 10 terms
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const { x, y } = context.raw;
            return `${label}: 빈도 ${x}, 감정 점수 ${y.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>감정 분석</h2>
      <div style={styles.chartContainer}>
        <Bubble data={sentimentBubbleData} options={options} />
      </div>
      <p style={styles.description}>감정 점수와 빈도에 따라 단어가 시각화된 버블 차트입니다.</p>
      <p style={styles.highlight}>
        <strong>가장 긍정적으로 반응한 단어:</strong> {mostPositiveTerm.term} (감정 점수: {mostPositiveTerm.sentiment_score.toFixed(2)})
      </p>
      <p style={styles.highlight}>
        <strong>가장 부정적으로 반응한 단어:</strong> {mostNegativeTerm.term} (감정 점수: {mostNegativeTerm.sentiment_score.toFixed(2)})
      </p>
    </section>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  chartContainer: {
    maxWidth: '800px',
    height: '450px', // Increased chart height
    margin: '0 auto',
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

export default SentimentAnalysis;
