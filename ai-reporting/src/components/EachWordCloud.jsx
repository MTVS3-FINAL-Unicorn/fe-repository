import React from 'react';

const EachWordCloud = ({ data }) => {
  if (!data) {
    return <p>데이터를 불러오는 중 문제가 발생했습니다.</p>;
  }

  const { wordcloud_filename, token_count } = data;

  if (!wordcloud_filename || !token_count) {
    return <p>필수 데이터가 누락되었습니다.</p>;
  }

  // 상위 10개 단어 추출
  const topWords = Object.entries(token_count)
    .sort(([, a], [, b]) => b - a) // 빈도 내림차순 정렬
    .slice(0, 10); // 상위 10개 단어 가져오기

  return (
    <div style={{ marginBottom: '20px', padding: '10px', borderRadius: '8px', textAlign: 'center', }}>
      <h2>워드클라우드 분석 결과</h2>
      {/* 워드클라우드 이미지 표시 */}
      <img
        src={wordcloud_filename}
        alt="Wordcloud Visualization"
        style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}
      />

      {/* 상위 10개 단어 테이블 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* 카드 목록 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
            {topWords.map(([word, count], idx) => (
            <div
                key={idx}
                style={{
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
                boxShadow: '4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                width: '140px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow =
                    '6px 6px 10px rgba(0, 0, 0, 0.2), -6px -6px 10px rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow =
                    '4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)';
                }}
            >
                <h4 style={{ margin: '10px 0', color: '#7967cb', fontSize: '20px', fontWeight: '600' }}>
                {word}
                </h4>
                <p style={{ margin: '10px 0', fontSize: '16px', fontWeight: '700', color: '#444' }}>
                빈도수: {count}
                </p>
            </div>
            ))}
        </div>

        {/* 주석 문구 */}
        <p
            style={{
            marginTop: '20px',
            fontSize: '16px',
            color: '#000',
            fontStyle: 'italic',
            textAlign: 'center',
            }}
        >
            해당 단어들은 워드클라우드 분석 결과에서 언급 빈도가 높은 단어를 나타냅니다.
        </p>
        </div>
    </div>
  );
};

export default EachWordCloud;
