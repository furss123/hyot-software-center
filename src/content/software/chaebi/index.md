---
name: Chaebi
name_ko: 채비
tagline: 일정·할 일·D-Day·메모를 한 화면에 모은 바탕화면 달력
tagline_en: A desktop calendar with events, to-dos, D-Days and notes in one window
description_en: |-
  Chaebi (채비, "getting ready") is a monthly calendar you keep open on your Windows desktop. Korean public holidays and substitute holidays are shown automatically, and events that span several days appear as one continuous bar.

  Each day has its own to-do list. Unfinished to-dos from earlier days can be moved to today with one click. D-Days are sorted by how soon they come, and those within seven days are highlighted. Notes support multiple tabs and pasted screenshots, and a note can be detached into its own window that stays on top.

  Data is saved to a file on your PC and backed up automatically once a day. You can also save a backup file and load it on another PC. Choose a light or dark theme and three text sizes. The app interface is in Korean.
category: classroom
platforms: [windows]
icon: ./icon.png
screenshots: [./main.png, ./event.png, ./settings.png, ./dark.png]
screenshot_titles: [월간 달력과 사이드바, 일정 추가, 설정, 다크 테마]
screenshot_titles_en: [Monthly calendar and sidebar, Adding an event, Settings, Dark theme]
requirements: [Windows 10·11 64비트]
requirements_en: [Windows 10 or 11, 64-bit]
order: 7
releases:
  - version: 2.1.0
    date: 2026-11-26
    channel: stable
    tag: chaebi-v2.1.0
    notes:
      - hyot.dev 첫 공개 버전
      - 월간 달력, 한국 공휴일·대체공휴일, 여러 날 일정 막대 표시
      - 날짜별 할 일, 지난 할 일을 오늘로 가져오기, D-Day, 여러 탭 메모와 메모 분리 창
      - 라이트·다크 테마, 글자 크기, 자동 실행, 매일 자동 백업과 백업 파일 저장·불러오기
    notes_en:
      - First release on hyot.dev
      - Monthly calendar with Korean public and substitute holidays and multi-day event bars
      - Daily to-dos with carry-over to today, D-Days, tabbed notes and detachable note windows
      - Light and dark themes, text size, start at sign-in, daily automatic backup and backup files
    downloads:
      - type: installer
        filename: Chaebi_2.1.0_x64-setup.exe
        url: https://github.com/furss123/hyot-software-center/releases/download/chaebi-v2.1.0/Chaebi_2.1.0_x64-setup.exe
        size: 3384850
        sha256: 58966ccaa9dd655a9dbf9955be7415c3367c7dc656ceffff4807a1d7181772b1
        arch: x64
---

채비는 바탕화면에 띄워 두고 쓰는 달력입니다. 한 달 일정과 오늘 할 일, 다가오는 D-Day, 메모를 한 화면에서 확인합니다.

### 달력과 일정

- 한국 공휴일과 대체공휴일을 자동으로 표시합니다.
- 날짜를 두 번 클릭하거나 ＋ 버튼으로 일정을 추가합니다. 색은 6가지, 시간은 선택입니다.
- 여러 날에 걸친 일정은 이어진 막대로 표시합니다.

### 할 일과 D-Day

- 날짜마다 할 일 목록이 있습니다. 끝내지 못한 지난 할 일은 한 번에 오늘로 가져옵니다.
- D-Day는 가까운 순서로 정렬하고, 7일 이내는 빨간색으로 강조합니다.

### 메모

- 탭을 여러 개 만들 수 있고, 화면 캡처를 붙여 넣을 수 있습니다.
- 메모를 별도 창으로 떼어 내 화면 어디에나 두고, 항상 맨 위에 고정할 수 있습니다. 다시 실행하면 같은 자리에 열립니다.

### 데이터

- 내용은 PC의 파일에 저장하고, 하루에 한 번 자동으로 백업합니다.
- 설정에서 백업 파일을 저장해 다른 PC에서 불러올 수 있습니다.
- 데이터 위치: `%APPDATA%\dev.hyot.calendar\`

### 설치와 실행

1. 설치 파일을 실행해 설치합니다. 시작 메뉴에는 **HyoT Calendar**로 추가됩니다.
2. Windows 시작할 때 자동으로 실행하려면 설정에서 **자동 실행**을 켭니다.
3. 이전 버전(1.x)을 쓰고 있었다면 그대로 덮어 설치합니다. 기존 일정과 메모를 자동으로 옮겨 옵니다.

Windows에서 "PC 보호" 창이 뜨면 **추가 정보** → **실행**을 누릅니다.
