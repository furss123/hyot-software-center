---
name: Today Meal
name_ko: 오늘 급식
tagline: 우리 학교 조식·중식·석식을 바탕화면 위젯과 휴대폰 앱으로
tagline_en: Your school's breakfast, lunch and dinner on a desktop widget or your phone
description_en: |-
  Today Meal shows your school's breakfast, lunch and dinner menus, using official NEIS school meal data. Search for any elementary, middle or high school in Korea and register it once.

  The Windows widget sits on your desktop and can be pinned on top of other windows or hidden in the tray. The Android app lets you flip between days and highlights dishes containing your allergens.

  Both run without installation steps: unzip and run the widget, or install the APK on Android.
category: etc
platforms: [windows, android]
icon: ./icon.png
requirements: [Windows 10 이상 64비트, Android]
order: 2
releases:
  - version: 1.0.0
    date: 2026-11-16
    channel: stable
    notes:
      - 첫 공개 버전
    downloads:
      - type: portable
        label: Windows 위젯
        filename: 오늘급식-위젯_1.0.0.zip
        url: /downloads/today-meal/today-meal-widget_1.0.0_x64.zip
        size: 82276153
        sha256: 851e8d31a0087b946823cd6bfba95902ae47e5453d63a4202b8d4490094ff4e4
        arch: x64
      - type: apk
        label: Android 앱
        filename: 오늘급식_1.0.0.apk
        url: /downloads/today-meal/today-meal_1.0.0.apk
        size: 5729587
        sha256: 799f865bae2269e8b3cd90b0fd3503cf84c4e0837c6fed85ae039b818a279e5c
---

학교를 한 번 등록해 두면 그날의 조식·중식·석식을 바로 보여 줍니다. 전국 초·중·고등학교를 검색할 수 있고, 식단은 나이스 교육정보 자료를 그대로 가져옵니다.

## Windows 위젯

- 바탕화면 한쪽에 작은 창으로 오늘 급식을 띄워 둡니다
- 핀 버튼으로 다른 창 위에 항상 고정
- – 버튼은 트레이로 숨기기, × 버튼은 완전히 종료
- 설치 과정 없이 압축을 풀고 **오늘급식-위젯.exe**를 실행하면 끝

## Android 앱

- 이전 날·다음 날로 넘기며 식단 확인
- 메뉴별 칼로리, 영양, 원산지 정보
- 내 알레르기 번호를 골라 두면 조심할 메뉴를 표시
- 인터넷이 잠깐 끊겨도 저장된 식단을 보여 줌

## 설치하기

**Windows** — 내려받은 압축 파일을 풀고 오늘급식-위젯.exe를 더블클릭합니다. 처음 실행할 때 Windows가 "PC 보호" 창을 띄우면 [추가 정보] → [실행]을 누르세요.

**Android** — 휴대폰에서 APK를 내려받아 엽니다. "출처를 알 수 없는 앱" 설치를 허용하라는 안내가 나오면 허용한 뒤 설치합니다.
