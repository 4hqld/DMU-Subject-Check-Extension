# 동양미래대 e-Class 과제 확인 Extension

동양미래대학교 e-Class에서 자동으로 과제 제출 상태를 확인하는 Chrome Extension입니다. 

e-Class에 로그인 후, 과제 데이터를 크롤링하여 팝업을 통해 실시간으로 과제 상태를 확인할 수 있습니다.

## 📑프로젝트 구성

이 프로젝트는 다음과 같은 주요 파일로 구성되어 있습니다:

- **popup.html**: 로그인 상태 및 과제 제출 상태를 표시하는 팝업 UI
- **popup.js**: 팝업에서 로그인 상태 및 과제 데이터를 처리하는 JavaScript 코드
- **popup.css**: 팝업 UI의 스타일을 정의한 CSS 파일
- **background.js**: Extension의 백그라운드에서 과제 데이터를 관리하는 스크립트
- **content.js**: eClass 페이지에서 로그인 상태를 확인하고 과제 데이터를 크롤링하는 스크립트
- **manifest.json**: Extension의 메타데이터를 정의한 설정 파일

## 💾프로젝트 프로그램 설치 방법

### 1. Chrome Extension 설치

1. **다운로드 및 압축 해제**
   - 프로젝트 파일을 다운로드하고 압축을 풀어주세요.

2. **Chrome 브라우저에서 확장 프로그램 설치**
   - Chrome 브라우저의 주소창에 `chrome://extensions/`를 입력하고 엔터를 눌러 확장 프로그램 페이지로 이동합니다.
   - 페이지 오른쪽 상단의 "개발자 모드"를 활성화합니다.
   - "압축 해제된 확장 프로그램을 로드" 버튼을 클릭하고, 다운로드한 프로젝트 폴더를 선택합니다.

3. **확장 프로그램 설치 완료**
   - 이제 Chrome에서 확장 프로그램이 활성화되고, eClass 페이지에서 로그인 상태를 감지하고 과제 상태를 표시할 수 있습니다.

## 🚩프로그램 사용방법

1. **eClass 로그인**
   - 동양미래대학교 eClass 사이트에 로그인합니다.

2. **팝업 열기**
   - 브라우저 우측 상단의 확장 프로그램 아이콘을 클릭하여 팝업을 엽니다.
   - 처음 로그인 시, 자동으로 팝업이 열립니다.

3. **과제 확인**
   - 로그인 상태가 확인되면, 과제 제출 상태가 표시됩니다. 과제 상태를 실시간으로 확인할 수 있습니다.
   - 과제 데이터가 없으면 자동으로 새로 크롤링하여 과제 상태를 갱신합니다.

4. **로그아웃 처리**
   - 로그아웃 상태가 감지되면, 크롤링한 데이터가 삭제되고 UI가 초기화됩니다.

## 🪪저작권 및 사용권 정보

이 프로젝트는 **MIT 라이선스** 를 따릅니다. 이를 통해 프로젝트의 소스 코드를 자유롭게 수정하고 사용할 수 있습니다.


하지만 이 프로젝트는 동양미래대학교의 지적 재산권을 사용하므로, 상업적 용도로의 사용은 금지됩니다.
- **Crawling Data**: 동양미래대학교 eClass 시스템
- **ICON**: 동양미래대학교 동그래

## 😊개발자

- **이름**: [4hqld]
- **이메일**: [hqld.dev@gmail.com]

## ⚠️버그 및 디버그

- **버그 리포트**: 만약 Extension에서 버그를 발견한 경우, GitHub의 Issues 섹션에 리포트해 주세요.
- **디버깅**: `popup.js`, `background.js`, `content.js` 파일에서 `console.log`를 이용하여 상태를 추적할 수 있습니다.

## 📌버전

## Version 1.25.327.0
- 로그인 감지
- UI 및 팝업 추가
- 크롤링 기능 구현
- 과제 제출 상태 확인

## Version 1.25.327.1
- 미제출 과제로 바로 이동할 수 있도록 링크 추가