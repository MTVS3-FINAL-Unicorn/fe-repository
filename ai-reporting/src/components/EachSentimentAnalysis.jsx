import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const EachSentimentAnalysis = ({ sentimentData }) => {
  if (!sentimentData) {
    return <p>시각화할 감정 분석 데이터가 없습니다.</p>;
  }

  const { token_count, most_common_token, ...sentiments } = sentimentData;

  // 문장별 감정 점수 데이터
  const sentences = Object.keys(sentiments);
  const sentimentScores = sentences.map(
    (sentence) => sentiments[sentence].sentiment_score
  );

  // 긍정/부정 문장 수 계산
  const positiveCount = sentimentScores.filter((score) => score >= 0.5).length;
  const negativeCount = sentimentScores.length - positiveCount;

  // 단어 빈도 데이터
  const tokenWords = Object.keys(token_count);
  const tokenFrequencies = Object.values(token_count);

  // 감정 분포 파이 차트 데이터
  const sentimentPieData = {
    labels: ['긍정 문장', '부정 문장'],
    datasets: [
      {
        data: [positiveCount, negativeCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // 단어 빈도 막대 차트 데이터
  const tokenBarData = {
    labels: tokenWords,
    datasets: [
      {
        label: '단어 빈도수',
        data: tokenFrequencies,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2>감정 분석 결과</h2>

      {/* 감정 분포 파이 차트 */}
      <div style={styles.chartContainer}>
        <h3>긍정과 부정 문장 분포</h3>
        <div style={styles.chart}>
          <Pie data={sentimentPieData} options={chartOptions} />
        </div>
         <p>
          이 차트는 분석된 문장 중 긍정적인 문장(감정 점수 ≥ 0.5)과
          부정적인 문장(감정 점수 &lt; 0.5)의 비율을 보여줍니다.
        </p>
      </div>

      {/* 단어 빈도 막대 차트 */}
      <div style={styles.chartContainer}>
        <h3>단어 빈도</h3>
        <div style={styles.chart}>
          <Bar data={tokenBarData} options={chartOptions} />
        </div>
        <p>
          이 차트는 분석된 문장에서 특정 단어가 얼마나 자주 등장했는지를
          보여줍니다.
        </p>
      </div>
    </div>
  );
};

// 스타일 정의
const styles = {
  container: {
    padding: '20px',
    lineHeight: 1.6,
    textAlign: 'center'
  },
  chartContainer: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  chart: {
    width: '80%', // 설명 영역과 비슷한 너비로 설정
    height: '400px', // 차트의 고정 높이
    margin: '0 auto',
  },
};

export default EachSentimentAnalysis;
