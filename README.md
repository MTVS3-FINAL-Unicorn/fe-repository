# Unicorn — AI Reporting

좌담회(미팅)에서 수집된 설문 응답을 AI로 분석한 결과를 보여주는 리포트 대시보드입니다. 전체 요약(워드클라우드, 주제 분석, 감성 분석, 임베딩 시각화)과 질문별 상세 분석을 탭으로 전환하며 확인할 수 있습니다.

실제 애플리케이션은 [`ai-reporting/`](./ai-reporting) 디렉터리에 있습니다.

## 주요 화면

- **전체 분석**: 좌담회 전체에 대한 워드클라우드, 주제(Topic) 분석, 감성(Sentiment) 분석, 임베딩(UMAP) 시각화
- **스크립트 분석**: 질문별 상세 응답과 선호도(Preference) 차트

## Tech Stack

- React 18 + Vite
- React Router
- Chart.js / react-chartjs-2 (차트), D3 + UMAP-js (임베딩 시각화), wordcloud
- Axios로 백엔드(`unicorn be-repository`) 리포트 API 호출

## 실행

```bash
cd ai-reporting
npm install
npm run dev
```

백엔드 API 주소는 `ai-reporting/src/utils/api.js`의 `API_BASE_URL`에서 설정합니다.

## 빌드

```bash
cd ai-reporting
npm run build
```
