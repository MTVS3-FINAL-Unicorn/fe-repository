import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getPreferenceAnswers } from '../utils/api';
import '../css/ResultsPage.css';

const PreferenceChart = ({ questionId }) => {
  const [preferenceData, setPreferenceData] = useState(null);

  useEffect(() => {
    const fetchPreferenceData = async () => {
      try {
        const answers = await getPreferenceAnswers(questionId);

        // 응답자의 선택 항목별로 개수 세기
        const counts = answers.reduce((acc, answer) => {
          acc[answer.content] = (acc[answer.content] || 0) + 1;
          return acc;
        }, {});

        // 데이터를 Bar 차트 형식으로 준비
        const data = {
          labels: Object.keys(counts), // 항목 이름
          datasets: [
            {
              label: '응답자 수',
              data: Object.values(counts), // 각 항목에 대한 응답 수
              backgroundColor: [
                '#a0d6f1', // 파스텔 하늘색
                '#b8e986', // 연두색
                '#f9e79f', // 밝은 노란색
                '#f8c471', // 부드러운 오렌지색
              ],
              borderColor: '#ddd', // 테두리 색상
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
        title: {
          display: true,
          text: '응답자 수',
        },
      },
      x: {
        title: {
          display: true,
          text: '선지 항목',
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 상단 범례 제거
      },
    },
  };

  return (
    <section
      className="preference-chart"
      style={{
        margin: '20px',
        textAlign: 'center', // 모든 텍스트 가운데 정렬
      }}
    >
      <h2>선호도형 질문 응답 분석</h2>
      <div
        className="chart-container"
        style={{
          padding: '20px',
          margin: '0 auto',
          maxWidth: '600px', // 차트의 최대 너비 제한
        }}
      >
        <Bar data={preferenceData} options={options} />
      </div>
      <p style={{ marginTop: '20px' }}>
        위 차트는 선호도형 질문에서 각 응답 항목에 대해 사용자가 선택한 개수를 나타냅니다.
      </p>
    </section>
  );
};

export default PreferenceChart;
