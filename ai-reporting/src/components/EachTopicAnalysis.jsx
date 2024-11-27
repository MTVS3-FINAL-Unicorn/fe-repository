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
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Sidebar: List of Topics */}
      <TopicList
        topics={topics}
        frequencies={frequencies}
        onTopicClick={handleTopicClick}
        selectedTopic={selectedTopic}
      />

      {/* Main Section: Details and Visualization */}
      <div style={{ flex: 1 }}>
        {selectedTopic !== null ? (
          <TopicDetails topic={selectedTopic} tinfo={data.tinfo} />
        ) : (
          <p>토픽을 선택하면 상세 정보를 볼 수 있습니다.</p>
        )}

        <Visualization coords={data.mdsDat} selectedTopic={selectedTopic} />
      </div>
    </div>
  );
};

const TopicList = ({ topics, frequencies, onTopicClick, selectedTopic }) => (
  <div style={{ width: "200px", border: "1px solid #ddd", padding: "10px" }}>
    <h3>토픽 목록</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {topics.map((topic, index) => (
        <li key={topic} style={{ marginBottom: "10px" }}>
          <button
            style={{
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: topic === selectedTopic ? "#007bff" : "#f8f9fa",
              color: topic === selectedTopic ? "white" : "black",
              border: "1px solid #ddd",
              width: "100%",
              textAlign: "center",
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

  // 현재 선택된 토픽의 데이터 필터링
  const topicData = terms
    .map((term, idx) => ({
      term,
      freq: frequencies[idx],
      category: categories[idx],
    }))
    .filter((item) => item.category === `Topic${topic}`)
    .sort((a, b) => b.freq - a.freq) // 빈도수 기준 내림차순 정렬
    .slice(0, 10); // 상위 10개 추출

  return (
    <div>
      <h3>토픽 {topic} 상세 정보</h3>
      {topicData.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>단어</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>빈도</th>
            </tr>
          </thead>
          <tbody>
            {topicData.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.term}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.freq.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>이 토픽에 해당하는 데이터가 없습니다.</p>
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
    <div style={{ marginTop: "20px" }}>
      <h3>토픽 시각화</h3>
      <div style={{ height: "400px" }}>
        <Scatter data={scatterData} options={options} />
      </div>
    </div>
  );
};

export default EachTopicAnalysis;
