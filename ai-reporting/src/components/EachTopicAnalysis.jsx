import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";

const EachTopicAnalysis = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { topics, Freq: frequencies } = data.mdsDat;

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <h3 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>토픽 분석 결과</h3>

      {/* Top Section: Topic List */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TopicList
          topics={topics}
          frequencies={frequencies}
          onTopicClick={handleTopicClick}
          selectedTopic={selectedTopic}
        />
      </div>

      {/* Bottom Section: Chart + Details */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <div style={{ flex: 1 }}>
          <Visualization coords={data.mdsDat} selectedTopic={selectedTopic} />
        </div>
        <div style={{ flex: 1 }}>
          {selectedTopic !== null ? (
            <TopicDetails topic={selectedTopic} tinfo={data.tinfo} />
          ) : (
            <p style={{ textAlign: "center", color: "#555" }}>
              토픽을 선택하면 상세 정보를 볼 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TopicList = ({ topics, frequencies, onTopicClick, selectedTopic }) => (
  <div style={{ width: "100%", textAlign: "center" }}>
    <h3 style={{ marginBottom: "10px" }}>토픽 목록</h3>
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap", // 가로 배치 및 영역 초과 시 줄바꿈
        justifyContent: "center", // 중앙 정렬
        listStyle: "none",
        padding: 0,
        gap: "10px", // 버튼 간격
      }}
    >
      {topics.map((topic, index) => (
        <li key={topic} style={{ marginBottom: "10px" }}>
          <button
            style={{
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: topic === selectedTopic ? "#7967cb" : "#f8f9fa",
              color: topic === selectedTopic ? "white" : "black",
              border: "1px solid #ddd",
              minWidth: "100px", // 버튼 최소 너비
            }}
            onClick={() => onTopicClick(topic)}
          >
            토픽 {topic} (빈도: {frequencies[index].toFixed(2)})
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const TopicDetails = ({ topic, tinfo }) => {
  const terms = tinfo.Term || [];
  const frequencies = tinfo.Freq || [];
  const categories = tinfo.Category || [];

  const topicData = terms
    .map((term, idx) => ({
      term,
      freq: frequencies[idx],
      category: categories[idx],
    }))
    .filter((item) => item.category === `Topic${topic}`)
    .sort((a, b) => b.freq - a.freq)
    .slice(0, 10);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>토픽 {topic} 상세 정보</h3>
      {topicData.length > 0 ? (
        <table style={styles.table}>
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th style={styles.tableHeader}>단어</th>
              <th style={styles.tableHeader}>빈도</th>
            </tr>
          </thead>
          <tbody>
            {topicData.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f1f1f1",
                  transition: "background-color 0.3s",
                }}
              >
                <td style={styles.tableCell}>{item.term}</td>
                <td style={styles.tableCell}>{item.freq.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#555" }}>
          이 토픽에 해당하는 데이터가 없습니다.
        </p>
      )}
    </div>
  );
};

const Visualization = ({ coords, selectedTopic }) => {
  const scatterData = {
    datasets: coords.topics.map((topic, index) => ({
      label: `토픽 ${topic}`,
      data: [{ x: coords.x[index], y: coords.y[index] }],
      backgroundColor: topic === selectedTopic ? "#ff6384" : "#36a2eb",
      borderColor: topic === selectedTopic ? "#ff6384" : "#36a2eb",
      borderWidth: topic === selectedTopic ? 3 : 1,
      pointRadius: topic === selectedTopic ? 10 : 6,
      pointHoverRadius: 12,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "PC1 (주요 성분 1)" },
      },
      y: {
        title: { display: true, text: "PC2 (주요 성분 2)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `토픽 ${context.dataset.label.split(" ")[1]}`,
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div>
      <div style={{ height: "360px", width: "600px", marginTop: "100px" }}>
        <Scatter data={scatterData} options={options} />
      </div>
    </div>
  );
};

const styles = {
  table: {
    width: "80%", // 테이블 너비를 화면 너비의 80%로 제한
    maxWidth: "280px", // 테이블 최대 너비 설정
    margin: "0 auto",
    borderCollapse: "collapse",
    tableLayout: "fixed", // 고정된 테이블 레이아웃 사용
  },
  tableHeader: {
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#7967cb",
  },
  tableCell: {
    padding: "8px",
    textAlign: "center",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
};

export default EachTopicAnalysis;
