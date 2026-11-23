---
name: Today Meal
name_ko: 오늘 급식
tagline: 우리 학교 조식·중식·석식을 웹, 바탕화면 위젯, 휴대폰에서
tagline_en: Your school's breakfast, lunch and dinner on the web, desktop and Android
description_en: |-
  Today Meal shows your school's breakfast, lunch and dinner menus, using official NEIS school meal data. Search for any elementary, middle or high school in Korea and register it once.

  The Windows widget sits on your desktop and can be pinned on top of other windows or hidden in the tray. The Android app lets you flip between days and highlights dishes containing your allergens.

  Open Today Meal in your browser to register a school and check its menus right away. Install the Windows widget once to launch it automatically at sign-in, or download the Android APK to update the app.
category: etc
platforms: [windows, android, web]
icon: ./icon.png
cover: ./cover.webp
requirements: [Windows 10 이상 64비트, Android]
requirements_en: [Windows 10 or later (64-bit), Android]
order: 2
releases:
  - version: 1.1.0
    date: 2026-11-23
    channel: stable
    notes:
      - Windows 위젯 실행 속도 개선 및 로그인 시 자동 시작
      - 브라우저에서 학교 등록과 급식 조회 지원
      - 학교 검색과 급식 조회 오류 처리 개선
    notes_en:
      - Faster Windows widget startup and automatic launch at sign-in
      - School registration and meal lookup in the browser
      - More reliable school search and meal loading
    downloads:
      - type: installer
        label: Windows 위젯
        label_en: Windows widget
        filename: 오늘급식-위젯_1.1.0.exe
        url: https://github.com/furss123/hyot-software-center/releases/download/today-meal-v1.1.0/today-meal-widget-setup-1.1.0-x64.exe
        size: 92918649
        sha256: 9011f5044fc835f9dd37bc6429249abe33ef9e9123ff0b3eeae2345ee75d07ce
        arch: x64
      - type: apk
        label: Android 앱
        label_en: Android app
        filename: 오늘급식_1.1.0.apk
        url: https://github.com/furss123/hyot-software-center/releases/download/today-meal-v1.1.0/today-meal-1.1.0.apk
        size: 5731433
        sha256: 6723c223570cfca021a626551fba7ce144fb59a71aa785f1a3b788de36add6fe
  - version: 1.0.0
    date: 2026-11-16
    channel: stable
    notes:
      - 첫 공개 버전
    downloads:
      - type: portable
        label: Windows 위젯
        label_en: Windows widget
        filename: 오늘급식-위젯_1.0.0.zip
        url: /downloads/today-meal/today-meal-widget_1.0.0_x64.zip
        size: 82276153
        sha256: 851e8d31a0087b946823cd6bfba95902ae47e5453d63a4202b8d4490094ff4e4
        arch: x64
      - type: apk
        label: Android 앱
        label_en: Android app
        filename: 오늘급식_1.0.0.apk
        url: /downloads/today-meal/today-meal_1.0.0.apk
        size: 5729587
        sha256: 799f865bae2269e8b3cd90b0fd3503cf84c4e0837c6fed85ae039b818a279e5c
---

학교를 한 번 등록해 두면 그날의 조식·중식·석식을 바로 보여 줍니다. 전국 초·중·고등학교를 검색할 수 있고, 식단은 나이스 교육정보 자료를 그대로 가져옵니다.

### 웹에서 보기

[오늘 급식 웹 페이지](/ko/today-meal/)에서 학교를 검색해 등록하면 브라우저에서 바로 급식을 볼 수 있습니다. 학교와 보기 설정은 사용하는 브라우저에 저장됩니다.

### Windows 위젯

- 바탕화면 한쪽에 작은 창으로 오늘 급식을 띄워 둡니다
- 핀 버튼으로 다른 창 위에 항상 고정
- – 버튼은 트레이로 숨기기, × 버튼은 완전히 종료
- Windows 로그인 시 자동 실행하며, 트레이 메뉴에서 자동 시작을 끌 수 있습니다

### Android 앱

- 이전 날·다음 날로 넘기며 식단 확인
- 메뉴별 칼로리, 영양, 원산지 정보
- 내 알레르기 번호를 골라 두면 조심할 메뉴를 표시
- 인터넷이 잠깐 끊겨도 저장된 식단을 보여 줌

### 설치하기

**Windows** — 내려받은 설치 파일을 한 번 실행합니다. 설치한 뒤 바탕화면이나 시작 메뉴에서 **오늘 급식**을 엽니다.

**Android** — 휴대폰에서 APK를 내려받아 엽니다. "출처를 알 수 없는 앱" 설치를 허용하라는 안내가 나오면 허용한 뒤 설치합니다.
