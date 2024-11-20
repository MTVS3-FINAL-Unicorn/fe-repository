import React from "react";
import { Bubble, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, BarElement, Tooltip, Legend, CategoryScale);

const SentimentAnalysis = ({ sentimentData }) => {
  if (!sentimentData || Object.keys(sentimentData).length === 0) {
    return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  }

  // 긍정 점수가 높은 6개, 부정 점수가 낮은 6개 단어
  const sortedBySentiment = Object.entries(sentimentData).sort(
    ([, a], [, b]) => b.sentiment_score - a.sentiment_score
  );
  const mostPositiveTerms = sortedBySentiment.slice(0, 6);
  const mostNegativeTerms = sortedBySentiment.slice(-6).reverse();
  const topLegendTerms = new Set([...mostPositiveTerms, ...mostNegativeTerms].map(([term]) => term));

  // 긍정 단어와 부정 단어로 범례 구성
  const positiveTerms = mostPositiveTerms.map(([term]) => term).join(", ");
  const negativeTerms = mostNegativeTerms.map(([term]) => term).join(", ");

  // 버블 차트 데이터
  const sentimentBubbleData = {
    datasets: Object.keys(sentimentData).map((term, index) => ({
      label: term, // 단어 자체를 툴팁과 범례에서 사용
      data: [
        {
          x: sentimentData[term].freq,
          y: sentimentData[term].sentiment_score,
          r: Math.sqrt(sentimentData[term].freq) * 4, // 크기 조정
        },
      ],
      backgroundColor: `rgba(${index * 25 % 255}, ${150 + index * 10 % 100}, ${
        200 - index * 15 % 150
      }, 0.7)`,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
    })),
  };

  // 막대 차트 데이터
  const sortedTerms = Object.entries(sentimentData)
    .sort(([, a], [, b]) => b.freq - a.freq)
    .slice(0, 10);
  const barChartData = {
    labels: sortedTerms.map(([term]) => term),
    datasets: [
      {
        label: "단어 빈도",
        data: sortedTerms.map(([, data]) => data.freq),
        backgroundColor: sortedTerms.map(
          (_, index) =>
            `rgba(${index * 25 % 255}, ${150 + index * 10 % 100}, ${200 - index * 15 % 150}, 0.7)`
        ),
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  // 감정 점수 분포 히스토그램 데이터
  const sentimentScores = Object.values(sentimentData).map((data) => data.sentiment_score);
  const bins = Array.from({ length: 10 }, (_, i) => i * 0.1);
  const histogramData = bins.map(
    (bin, i) => sentimentScores.filter((score) => score >= bin && score < bin + 0.1).length
  );
  const histogramChartData = {
    labels: bins.map((bin) => `${bin.toFixed(1)}-${(bin + 0.1).toFixed(1)}`),
    datasets: [
      {
        label: "감정 점수 분포",
        data: histogramData,
        backgroundColor: bins.map(
          (_, index) =>
            `rgba(${index * 25 % 255}, ${150 + index * 10 % 100}, ${200 - index * 15 % 150}, 0.7)`
        ),
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const bubbleOptions = {
    scales: {
      x: { title: { display: true, text: "단어 빈도 (Frequency)" } },
      y: { title: { display: true, text: "감정 점수 (Sentiment Score)" }, min: 0, max: 1 },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom", // 범례를 차트 아래로 이동
        labels: {
          generateLabels: () => [
            { text: `긍정 점수가 높은 단어(상위 6개): ${positiveTerms}`, fillStyle: "rgba(0, 200, 0, 0.6)" },
            { text: `부정 점수가 높은 단어(상위 6개): ${negativeTerms}`, fillStyle: "rgba(200, 0, 0, 0.6)" },
          ],
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const { x, y, r } = context.raw;
            return `${label}: 빈도 ${x}, 감정 점수 ${y.toFixed(2)}, 크기 ${r.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <section style={styles.container}>
      <h2 style={{ ...styles.title, marginBottom: "10px" }}>감정 분석</h2> {/* 간격 줄임 */}
      <p style={{ ...styles.explanation, marginBottom: "30px" }}>
            * 0에 가까울수록 부정적인 반응이, 1에 가까울수록 긍정적인 반응이 강합니다.
      </p>
      <div style={{ ...styles.bubbleChart, marginTop: "40px" }}>
        <p style={styles.chartDescription}>감정 점수와 단어 빈도를 나타낸 버블 차트</p>
        <Bubble data={sentimentBubbleData} options={bubbleOptions} />
      </div>
      <div style={styles.barCharts}>
        <div style={styles.chartContainer}>
          <p style={styles.chartDescription}>가장 언급량이 많은 단어 상위 10개</p>
          <Bar data={barChartData} options={styles.barOptions} />
        </div>
        <div style={styles.chartContainer}>
          <p style={styles.chartDescription}>전반적인 감정 점수 분포<br/>
            <Bar data={histogramChartData} options={styles.histogramOptions} /></p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    marginBottom: "40px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  bubbleChart: {
    width: "60%",
    height: "400px", // 높이도 조정
    margin: "0 auto",
  },
  barCharts: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  chartContainer: {
    width: "45%",
  },
  barOptions: {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "빈도" } },
      y: { title: { display: true, text: "단어" } },
    },
  },
  histogramOptions: {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "감정 점수 구간" } },
      y: { title: { display: true, text: "빈도" } },
    },
  },
  chartDescription: {
    fontSize: "20px",
    color: "#555",
    marginTop: "10px",
  },
  explanation: {
    fontSize: "14px",
    color: "#555",
    marginTop: "10px",
  },
};

export default SentimentAnalysis;
