# ai-reporting

Unicorn 좌담회 AI 분석 리포트 대시보드 (React + Vite).

## 구조

```
src/
  pages/ResultsPage.jsx        # 탭(전체 분석 / 스크립트 분석) 전환, 데이터 로딩
  components/
    WordCloud.jsx              # 전체 워드클라우드
    TopicAnalysis.jsx          # 전체 주제 분석
    SentimentAnalysis.jsx      # 전체 감성 분석
    EmbeddingVisualization.jsx # 전체 임베딩(UMAP) 시각화
    DetailedContent.jsx        # 질문별 상세 분석 탭
    Each*.jsx                  # 질문 단위 워드클라우드/주제/감성/임베딩
    PreferenceChart.jsx        # 선호도형 설문 응답 차트
  utils/api.js                 # 백엔드 report API 호출 (axios)
```

## 실행

```bash
npm install
npm run dev
```

`src/utils/api.js`의 `API_BASE_URL`을 연결할 백엔드 주소로 맞춰주세요.

## 빌드 / 미리보기

```bash
npm run build
npm run preview
```
