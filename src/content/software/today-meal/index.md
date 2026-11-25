---
name: School Today
name_ko: 오늘 학교
tagline: 우리 반 시간표와 학교 급식을 한 화면에서 확인하는 도구
tagline_en: Check your class timetable and school meals in one view
description_en: |-
  School Today brings your daily timetable and school meals together. Choose a Korean school and class, then pick a date to see both. School and subject names and meal menus appear in Korean.

  Open breakfast, lunch or dinner to see the dishes, calories, nutrition and origin details. Set the allergens you want to highlight. Recent timetables and menus stay available on the same device after they have loaded.

  Choose a theme, switch to larger timetable and meal text, or pick which meal the app shows first. On Windows, the app can start at sign-in or stay above your other windows.
category: classroom
platforms: [windows, android, web]
icon: ./icon.png
cover: ./cover.webp
requirements: [Windows 10 이상 64비트, Android 6.0 이상]
requirements_en: [Windows 10 or later (64-bit), Android 6.0 or later]
order: 2
releases:
  - version: 2.1.1
    date: 2026-11-24
    channel: stable
    tag: today-school-v2.1.1
    notes:
      - 시간표와 식판을 모티브로 새 아이콘과 삽화 제작
      - hyot.dev 색상과 서체에 맞춰 웹페이지 제목과 조작 버튼 배치 정리
      - 현재 설치 경로와 일치하는 Windows 자동 시작 상태 표시
    notes_en:
      - New timetable and lunch-tray icon and illustrations
      - Web page styling and controls follow the Hyot.dev design
      - Windows startup status reflects the current installation path
    downloads:
      - type: installer
        label: Windows 위젯
        label_en: Windows widget
        filename: 오늘학교-위젯-2.1.1.exe
        url: https://github.com/furss123/hyot-software-center/releases/download/today-school-v2.1.1/today-school-widget-setup-2.1.1-x64.exe
        size: 88002673
        sha256: b579628196bba18706dd285670d0ef6068e7dfacb08802e7d82503172701ef49
        arch: x64
      - type: apk
        label: Android 앱
        label_en: Android app
        filename: 오늘학교-2.1.1.apk
        url: https://github.com/furss123/hyot-software-center/releases/download/today-school-v2.1.1/today-school-2.1.1.apk
        size: 4820843
        sha256: fcfcb7c6795107fbb7dbd79c763c734579565eb0f3a825ee90438f1a7af15221
  - version: 2.1.0
    date: 2026-11-24
    channel: stable
    tag: today-school-v2.1.0
    notes:
      - Windows 자동 시작과 항상 위에 표시를 앱 설정에서 변경
      - 시스템 설정·라이트·다크 테마, 큰 글자, 먼저 볼 급식 선택
      - 모바일에서 시간표와 급식으로 바로 이동
    notes_en:
      - Control Windows startup and always-on-top from the app
      - Choose a theme, larger text, and your preferred meal
      - Jump directly to timetable or meals on a phone
    downloads:
      - type: installer
        label: Windows 위젯
        label_en: Windows widget
        filename: 오늘학교-위젯_2.1.0.exe
        url: https://github.com/furss123/hyot-software-center/releases/download/today-school-v2.1.0/today-school-widget-setup-2.1.0-x64.exe
        size: 87882903
        sha256: c03f4835fb442b1fca41474d3ce20bc50152de8e4c0f89a4cba13871f8837e82
        arch: x64
      - type: apk
        label: Android 앱
        label_en: Android app
        filename: 오늘학교_2.1.0.apk
        url: https://github.com/furss123/hyot-software-center/releases/download/today-school-v2.1.0/today-school-2.1.0.apk
        size: 4514951
        sha256: 74ed63cab5f4e1fdee0fe8a5c00c88f6ef452211b893bee5a32ecaeb457a3eed
  - version: 2.0.0
    date: 2026-11-24
    channel: stable
    notes:
      - 시간표와 급식을 같은 날짜로 조회하는 통합 화면
      - 웹과 Windows·Android 앱에 새 화면과 아이콘 적용
    notes_en:
      - View timetables and meals together using a shared date selector
      - Updated design and icons for the web, Windows and Android
  - version: 1.1.1
    date: 2026-11-24
    channel: stable
    notes:
      - Windows에서 위젯을 종료한 뒤에도 실행 중이라는 안내가 표시되어 업데이트가 막히던 문제 수정
    notes_en:
      - Fixed a Windows update error that reported the widget was still running after it had closed
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

오늘 학교는 교시별 시간표와 학교 급식 메뉴를 한 화면에서 보여 주는 Windows·Android·웹 프로그램입니다. 학교와 학년·반을 한 번 선택한 뒤 요일을 선택하거나 이전 날·다음 날 버튼으로 날짜를 바꾸면 두 정보가 함께 바뀝니다.

### 시간표와 급식

- 시간표에서 교시별 과목을 확인합니다.
- 조식·중식·석식을 선택해 메뉴, 열량, 영양 정보와 원산지를 봅니다.
- 설정에서 화면 테마, 시간표·급식 글자 크기, 먼저 볼 급식과 알레르기 표시를 바꿉니다.
- 학교와 학급은 기기에 저장되며, 최근에 조회한 시간표와 급식을 다시 볼 수 있습니다.

### 설치와 실행

- **웹** · [오늘 학교 열기](/ko/today-school/)에서 학교와 학년·반을 선택합니다.
- **Windows** · 설치 후 시작 메뉴에서 **오늘 학교**를 엽니다. 앱 설정이나 트레이 메뉴에서 로그인 시 자동 시작과 항상 위에 표시를 켜고 끌 수 있습니다.
- **Android** · 휴대폰에 APK를 내려받아 설치합니다.

학교가 나이스에 공개한 정보가 표시됩니다.
