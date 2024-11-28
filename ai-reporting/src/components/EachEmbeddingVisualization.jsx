import React from 'react';

const EachEmbeddingVisualization = ({ embeddingData }) => {
  if (!embeddingData) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <div style={{ margin: "20px auto", textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px", fontSize: "28px" }}>답변 유사도 분석</h3>
      <p style={{ marginBottom: "20px", fontSize: "16px", color: "#555" }}>
        질문별 답변 간 유사도 분석을 통해 비슷한 답변과 의견을 확인할 수 있습니다. <br />
        이를 통해 각 질문에서 도출된 주요 패턴과 관점을 시각적으로 이해할 수 있습니다.
      </p>
      <iframe
        src={embeddingData}
        title="Each Embedding Visualization"
        style={{
          width: "1000px",
          height: "800px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default EachEmbeddingVisualization;
