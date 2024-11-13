import React, { useState } from 'react';

const WordCloud = ({ imageSrc }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>워드 클라우드</h2>
      <p style={styles.description}>자주 언급된 단어들을 한눈에 볼 수 있는 워드 클라우드입니다.</p>
      <div style={styles.imageContainer}>
        {loading && <p>이미지 로딩 중...</p>}
        {error ? (
          <p style={styles.error}>이미지를 불러오지 못했습니다.</p>
        ) : (
          <img
            src={imageSrc}
            alt="Word Cloud"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={loading ? { display: 'none' } : styles.image}
          />
        )}
      </div>
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
  description: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  imageContainer: {
    position: 'relative',
    minHeight: '300px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: '#d9534f',
    fontSize: '16px',
  },
};

export default WordCloud;
