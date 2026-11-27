---
name: 짐싸
tagline: 자리를 옮길 때 내 파일은 USB로 챙기고 PC의 개인 정보는 삭제하는 도구
tagline_en: Pack your files onto a USB drive and wipe your traces before handing over a PC
description_en: |-
  Jimssa (짐싸, "pack up") is for the day you hand your PC over to someone else, such as a teacher changing desks at the end of the school year. It copies or moves your files to a USB drive and removes what you leave behind.

  It finds files on the Desktop, Documents (including KakaoTalk downloads), Downloads, Pictures, Videos, Music and folders you created on your drives, and sorts them by type. It can also log you out of every website and desktop app, remove personal programs while keeping work programs such as Hancom Office, Microsoft Office and Korean school security modules, back up and delete certificates (GPKI, NPKI), and clear recent-file lists, clipboard history, temp files and startup entries.

  Only files that were copied successfully are deleted from the PC. The ZIP contains a single self-contained executable, so no .NET installation is needed. The app interface is in Korean.
category: system
platforms: [windows]
icon: ./icon.png
screenshots: [./main.png, ./files.png, ./privacy.png, ./programs.png, ./done.png, ./dark.png]
screenshot_titles: [정리 방식과 저장 위치, 가져갈 파일, 삭제할 개인 정보, 개인 프로그램 선택, 완료, 다크 모드]
screenshot_titles_en: [Mode and destination, Files to take, Personal data to remove, Choosing personal programs, Finished, Dark theme]
requirements: [Windows 10·11 64비트, USB 메모리 또는 외장 하드]
requirements_en: [Windows 10 or 11, 64-bit, USB drive or external disk]
order: 6
releases:
  - version: 1.0.1
    date: 2026-11-27
    channel: stable
    tag: jimssa-v1.0.1
    notes:
      - 파일 단계가 끝난 뒤 중지해도 '완료'로 표시되던 문제를 고쳤습니다.
      - 프로그램 제거 중에 중지를 누르면 바로 멈춥니다.
      - Dropbox·Google Drive 같은 클라우드 동기화 폴더와 가상 드라이브는 기본으로 건드리지 않습니다.
      - 임시 파일을 지울 때 연결 지점(junction) 너머의 파일까지 지울 수 있던 문제를 고쳤습니다.
      - 임시 폴더·AppData는 백업 위치로 고를 수 없습니다.
      - 사용자 계정에 설치된 업무 프로그램의 자동 실행은 남깁니다.
      - 완료 화면에 '처음으로' 버튼을 추가해 중지한 작업을 이어서 진행할 수 있습니다.
      - 긴 경로 표시와 결과 화면의 백업 크기를 바로잡았습니다.
    notes_en:
      - Stopping after the file step is now reported as stopped instead of finished.
      - Stop now takes effect immediately while a program is being uninstalled.
      - Cloud sync folders such as Dropbox and Google Drive, and virtual drives, are left untouched by default.
      - Temp file cleanup no longer follows junctions into other folders.
      - Temp and AppData folders can no longer be chosen as the backup location.
      - Startup entries of work programs installed per user are kept.
      - A Start over button on the result screen lets you resume a stopped run.
      - Fixed long path display and the backup size shown on the result screen.
    downloads:
      - type: portable
        filename: Jimssa-1.0.1-win-x64.zip
        url: https://github.com/furss123/hyot-software-center/releases/download/jimssa-v1.0.1/Jimssa-1.0.1-win-x64.zip
        size: 43864276
        sha256: 7039f5d70abd731b063f8eb251c3231c597a4519f84e28784dc7ff0c63b17477
        arch: x64
  - version: 1.0.0
    date: 2026-11-27
    channel: stable
    tag: jimssa-v1.0.0
    notes:
      - 첫 공개 버전
      - 파일 백업·이동, 웹사이트와 프로그램 로그아웃, 개인 프로그램 제거, 인증서 백업·삭제, 사용 기록 정리를 지원합니다.
    notes_en:
      - First public release
      - File backup and move, logout from websites and apps, personal program removal, certificate backup and removal, and history cleanup.
    downloads:
      - type: portable
        filename: Jimssa-1.0.0-win-x64.zip
        url: https://github.com/furss123/hyot-software-center/releases/download/jimssa-v1.0.0/Jimssa-1.0.0-win-x64.zip
        size: 43862387
        sha256: cf75032199aced9011dc29544b380c8170166abaea40a10558faadc19248b979
        arch: x64
---

짐싸는 업무분장이 바뀌어 자리를 옮기거나 PC를 다른 사람에게 넘겨줄 때 쓰는 프로그램입니다. 1년 동안 쌓인 내 파일은 USB로 챙기고, PC에 남은 계정·사용 기록·개인 프로그램은 삭제합니다.

### 네 단계로 정리

1. **정리 방식** — `자리 이동`(USB로 옮기고 PC에서 삭제), `백업`(복사만), `삭제`(백업 없이 삭제) 중 하나를 고르고 저장할 USB를 선택합니다.
2. **파일** — 한글·Office·PDF·이미지·동영상 등 종류별로 선택합니다. `보기`에서 파일을 하나씩 제외할 수 있습니다.
3. **개인 정보** — 삭제할 항목을 켜고 끕니다.
4. **확인** — 처리할 내용을 한 화면에서 확인한 뒤 시작합니다.

### 찾는 파일

바탕화면, 문서(카카오톡 받은 파일 포함), 다운로드, 사진, 동영상, 음악, 사용자 폴더와 `C:\`·`D:\`에 직접 만든 폴더를 찾습니다. USB에는 원래 폴더 구조 그대로 저장됩니다.

### 삭제하는 개인 정보

| 구분 | 항목 |
|---|---|
| 계정 | 모든 웹사이트 로그인·방문 기록·저장된 비밀번호(즐겨찾기는 백업), Claude·ChatGPT·Microsoft 365·OneDrive 등 프로그램 로그인, 카카오톡 PC, Windows 저장 비밀번호, Wi-Fi |
| 프로그램 | 개인 프로그램 제거와 남은 데이터 삭제. 한컴오피스, Microsoft Office, 학교 보안 모듈, K-에듀파인, 쿨메신저, 프린터 프로그램은 유지 |
| 인증서와 메모 | GPKI·NPKI 인증서와 스티커 메모를 백업한 뒤 삭제 |
| 사용 기록 | 최근 문서, 탐색기 검색, 클립보드, 임시 파일, 휴지통 |
| 시스템 | 배경 화면, 시작 프로그램·예약 작업, 개발 도구 설정 |

### 안전하게

- 복사가 끝난 파일만 PC에서 삭제합니다. 중간에 멈추면 원본은 삭제하지 않고, 다시 실행하면 이어서 진행합니다.
- Windows·프로그램 폴더와 백신의 랜섬웨어 감시용 파일은 건드리지 않습니다.
- OneDrive·Dropbox·Google Drive 같은 클라우드 동기화 폴더는 기본으로 제외합니다.
- 처리한 내용은 백업 폴더의 기록 파일에 남습니다.

### 설치와 실행

1. 다운로드한 ZIP의 압축을 풀고 **Jimssa.exe**를 실행합니다. 따로 설치할 것은 없습니다.
2. 관리자 권한을 묻는 창에서 **예**를 누르면 프로그램 제거와 인증서 삭제까지 진행할 수 있습니다.
3. 열려 있는 한글·Office 문서는 저장하고 닫은 뒤 시작합니다.

Windows에서 "PC 보호" 창이 뜨면 **추가 정보** → **실행**을 누릅니다. 백신이 실행을 막으면 예외로 등록한 뒤 다시 실행합니다.
