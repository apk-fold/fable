<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · **한국어** · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable 아이콘"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>근무 시간과 세전 급여를 계산기 없이.</b><br>프랑스의 파견(intérim), 기간제(CDD), 정규직(CDI) 계약을 위한 근무 시간 기록 앱: 단계별 초과 근무, 야간, 일요일, 공휴일, 식대, IFM, 유급 휴가.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ APK 다운로드</b></a> · Android 7 이상 · 무료, 오프라인, 계정 불필요</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="홈과 출퇴근 기록기">
  <img src="../../docs/historique.png" width="200" alt="기록">
  <img src="../../docs/resume.png" width="200" alt="월간 요약">
  <img src="../../docs/mission.png" width="200" alt="근무처 설정">
</p>

## 설치

1. 휴대폰에서 위의 **APK 다운로드** 링크(또는 최신 [release](https://github.com/apk-fold/fable/releases/latest))를 엽니다.
2. Android가 요청하면 브라우저에서의 설치를 허용한 뒤 설치합니다.
3. 새 버전은 이전 버전 위에 덮어쓰기로 설치됩니다: 서명이 같아 데이터가 유지됩니다.

`main`에 푸시된 코드 변경마다 APK가 자동으로 다시 빌드되고(GitHub Actions) 새 release가 게시됩니다.

### 서명

서명 키는 저장소에 없습니다. GitHub Actions가 시크릿 **`FABLE_KEYSTORE_B64`**(base64로 인코딩한 `.jks` 파일, 비밀번호 `FABLE_KEYSTORE_PASSWORD`는 선택)에서 읽어 옵니다. 이 시크릿이 없으면 APK는 임시 키로 서명됩니다: 설치는 되지만, 다음 버전에서 이전 버전을 제거하라고 요구합니다.

## 앱의 기능

**입력**
- 출퇴근 기록기: *시작*, *휴식*, *종료* — 그날의 기록이 자동으로 만들어집니다(15분 단위 반올림 선택 가능).
- 직접 입력: 날짜, 시작 → 종료(자정을 넘기는 근무 지원), 휴식, **+ 초과 근무** 버튼(+15분, +30분, +1시간).
- 입력하는 동안 계산 결과를 실시간으로 미리 보여 주고, 두 날짜가 겹치면 경고합니다.
- 하루를 같은 주의 다른 요일에 반복, 하루 복제, 식대를 날짜별로 강제 추가하거나 제외.

**근무처**(고용주나 파견 회사마다 하나), 각각 고유한 규칙:
- 계약 유형: 파견(intérim), 기간제(CDD), 정규직(CDI), 기타 — 세전 시급, 색상.
- 주 단위 또는 일 단위 **초과 근무**, 2단계(예: 35시간부터 +25%, 43시간부터 +50%).
- 시간대를 조정할 수 있는 **야간 근무**(기본 21시 → 6시)와 그 가산율.
- **일요일**과 **공휴일**: 기본은 **프랑스 본토(파리)** 달력, 또는 **알자스모젤**(+ 성금요일과 12월 26일). 모든 근무처에 공통으로 설정합니다.
- 가산 누적 방식: 합산 또는 가장 높은 것만; 토요일에서 일요일로 넘어가는 야간은 시작일 기준 또는 시간 단위로 계산.
- 근무일마다 또는 일정 시간 이상 근무한 날의 **식대**, 하루 단위 **교통비**.
- **IFM**(파견 종료 수당) 또는 **계약 종료 수당**(CDD)과 **ICCP**(유급 휴가 수당), 기본 10% + 10%.
- 한 달 전체 또는 어긋난 **급여 기간**(예: 21일부터 다음 달 20일까지), 기본 근무 시간과 휴식.

**집계**
- 홈: 출퇴근 기록기, 초과 근무 기준 게이지가 있는 이번 주 현황, 이번 달 합계.
- 월별 기록을 주 단위로 묶은 목록이나 달력으로 보기, 근무처별 필터.
- 주 / 월 / 연 요약: 근무 시간, 단계별 초과 근무, 야간, 일요일, 공휴일, 근무일 수, 그래프, 세전 급여부터 **예상 실수령액**까지의 내역(공제율 조정 가능).
- **PDF 내보내기**(바로 보낼 수 있는 근무 기록표), **Excel .xlsx**, **CSV** — 구독 없음.

**그 밖에**
- 원하는 요일과 시각에 알림.
- 설정에서 **모든 것을 원하는 대로**: 다크, 블랙(AMOLED), 라이트, 자동 테마; 기본 색상과 가산 항목별 색상(팔레트 또는 자유 색상); 글꼴; 글자 크기; 모서리; 밀도; 애니메이션; 시간 표시 형식(7 h 30, 7h30, 7,5 h); 금액을 숨기는 조용한 모드; 시작 화면; 기록 보기 방식. 근무처마다 자유 색상도 지정할 수 있습니다.
- `.json` 파일로 백업 / 복원, 앱 전용 파일에 자동 백업 사본 저장.
- 데이터는 휴대폰 밖으로 나가지 않습니다: 계정 없음, 서버 없음, 광고 없음.

## 계산 방식

하루를 분 단위로 나눕니다. 일한 1분마다 Fable은 그것이 야간인지, 일요일인지, 공휴일인지, 그리고 어떤 초과 근무 단계에 속하는지(월요일부터 일요일까지의 주간 누적, 시간 순서대로)를 알고 있습니다. 휴식은 비례하여 차감합니다. 두 달에 걸친 주는 주 전체를 계산한 뒤, 기간 안에 있는 날만 합산합니다.

- 세전 급여 = 시간 × 시급 + 가산액
- IFM / 계약 종료 수당 = 세전 급여 × 10%
- ICCP = (세전 급여 + IFM) × 10%
- 예상 실수령액 = 세전 합계 − 공제액(기본 22%) + 식대와 교통비

이 값들은 **추정치**입니다: 단체 협약과 급여 명세서가 기준입니다.

## 개발

```bash
npm install
npm run dev        # 브라우저에서 인터페이스 실행
npm test           # 계산 엔진 테스트
npm run sync       # 웹 빌드 + Android 프로젝트 (처음에는 "npx cap add android" 실행 후)
npm run open       # Android Studio에서 프로젝트 열기
```

구조: `src/core`(계산, 공휴일, 저장, PDF/Excel 내보내기), `src/views`(화면), `src/ui`(컴포넌트), `scripts/patch-android.mjs`(Android 프로젝트의 이름, 아이콘, 테마, 서명), `tests/`(엔진 테스트와 인터페이스 시나리오 테스트).

기술 스택: 프레임워크 없는 HTML/CSS/JS, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). 글꼴 Manrope와 Unbounded(SIL Open Font License).
