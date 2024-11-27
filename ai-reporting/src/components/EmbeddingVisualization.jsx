import React from 'react';

const EmbeddingVisualization = ({ tensorBoardUrl }) => (
  <section style={styles.container}>
    <h2>TensorBoard 임베딩 시각화</h2>
    <iframe
      src={tensorBoardUrl}
      width="100%"
      height="500px"
      title="TensorBoard Embedding Visualization"
      style={{ border: '1px solid #ddd', borderRadius: '8px' }}
    />
    <p>임베딩 시각화 결과입니다. 이곳에서 답변의 유사도를 더 자세히 탐색할 수 있습니다.</p>
  </section>
);

const styles = {
  container: {
    padding: '20px',
    lineHeight: 1.6,
    textAlign: 'center'
  },
}

export default EmbeddingVisualization;
