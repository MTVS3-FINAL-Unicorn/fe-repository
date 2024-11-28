import React from 'react';

const EmbeddingVisualization = ({ embeddingData }) => {
  if (!embeddingData) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <div style={{ margin: "20px auto", textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px", fontSize: "28px" }}>임베딩 분석</h3>
      <p style={{ marginBottom: "20px", fontSize: "16px", color: "#555" }}>
        임베딩 분석은 데이터의 다차원 공간을 시각화하여, 항목 간의 유사성과 관계를 쉽게 이해할 수 있도록 돕습니다. <br/>
        아래 시각화는 고차원 데이터를 2D 또는 3D로 투영하여 좌담회 내 언급된 단어 간의 거리, 유사도 등의 구조적 관계를 보여줍니다.
      </p>
      <iframe
        src={embeddingData}
        title="Embedding Visualization"
        style={{
          width: "1200px",
          height: "800px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default EmbeddingVisualization;
