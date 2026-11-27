---
name: 말끔
tagline: 포맷하지 않고 Windows를 처음 설치한 상태처럼 정리하는 도구
tagline_en: Reset Windows to a freshly installed state without reformatting
description_en: |-
  Malkkeum (말끔, "neat and clean") brings a PC back to the state it was in right after Windows was installed, without reformatting. Check the programs you want to keep, and it removes every other program, your personal files and usage history.

  Programs you keep stay installed with their settings, so there is nothing to reinstall. Drivers, manufacturer utilities and Windows components such as .NET, Visual C++ and Edge are never touched. Work programs such as Hancom Office, Microsoft Office, printers, browsers and Korean school security modules are kept by default.

  Choose Remove everything (like a reformat) or Programs only (keep your files). Other drives such as D: and cloud folders such as OneDrive are left alone unless you turn them on. The ZIP contains a single self-contained executable, so no .NET installation is needed. The app interface is in Korean.
category: system
platforms: [windows]
icon: ./icon.png
screenshots: [./main.png, ./programs.png, ./files.png, ./confirm.png, ./done.png, ./dark.png]
screenshot_titles: [초기화 방식, 남길 프로그램 선택, 지울 파일과 기록, 확인, 완료, 다크 모드]
screenshot_titles_en: [Reset mode, Choosing programs to keep, Files and history to remove, Review, Finished, Dark theme]
requirements: [Windows 10·11 64비트, 관리자 권한]
requirements_en: [Windows 10 or 11, 64-bit, Administrator rights]
order: 8
releases:
  - version: 1.0.0
    date: 2026-11-27
    channel: stable
    tag: malkkeum-v1.0.0
    notes:
      - 첫 공개 버전
      - 남길 프로그램만 고르면 나머지 프로그램, 내 파일, 사용 기록을 삭제합니다.
      - 드라이버와 Windows 구성 요소는 건드리지 않습니다.
    notes_en:
      - First public release
      - Pick the programs to keep; everything else, your files and usage history are removed.
      - Drivers and Windows components are never touched.
    downloads:
      - type: portable
        filename: Malkkeum-1.0.0-win-x64.zip
        url: https://github.com/furss123/hyot-software-center/releases/download/malkkeum-v1.0.0/Malkkeum-1.0.0-win-x64.zip
        size: 43963051
        sha256: 73625885b38b3ca94ec10896fab7119c51760cd94bdf6b82ba4bae7e4fa0d052
        arch: x64
---

말끔은 Windows를 다시 설치하지 않고도 **처음 설치한 상태처럼** 정리하는 프로그램입니다. 남길 프로그램만 체크하면 나머지 프로그램, 내 파일, 사용 기록을 삭제합니다. 남긴 프로그램은 설정까지 그대로 남아서 다시 설치할 필요가 없습니다.

### 다섯 단계로 정리

1. **방식** — `모두 지우기`(포맷처럼 프로그램, 내 파일, 기록 삭제) 또는 `프로그램만 정리`(내 파일은 유지)를 고릅니다.
2. **남길 프로그램** — 체크한 프로그램은 남기고 나머지는 제거합니다. 이름 검색과 `전체 / 제거 / 남김` 거르기로 빨리 찾을 수 있습니다.
3. **파일과 기록** — 지울 위치와 함께 정리할 항목(브라우저, 사용 기록, 시작 프로그램, 배경 화면, 임시 파일)을 켜고 끕니다.
4. **확인** — 처리할 내용을 한 화면에서 확인하고 동의한 뒤 시작합니다.
5. **완료** — 결과를 확인하고 PC를 다시 시작합니다.

### 지우는 것과 남기는 것

| 지움 | 남김 |
|---|---|
| 체크하지 않은 프로그램과 남은 데이터 폴더 | 드라이버(그래픽, 사운드, 네트워크, 터치패드, 펜), 제조사 프로그램 |
| 바탕화면, 문서, 다운로드, 사진, 동영상, 음악의 파일 | .NET, Visual C++, Java, Edge 같은 Windows 구성 요소 |
| 사용자 폴더와 C 드라이브에 직접 만든 폴더 | 남길 프로그램, 설치 폴더와 설정 |
| 웹 브라우저 데이터, 최근 문서, 임시 파일, 휴지통 | 남길 프로그램을 가리키는 바로 가기 |
| 지운 프로그램의 자동 실행, 깨진 바로 가기 | D 드라이브 같은 다른 드라이브, OneDrive (기본 꺼짐) |

한컴오피스, Microsoft Office, 프린터, 브라우저, 학교 보안 모듈(알약, Genian, Wizvera 등)은 처음부터 남기도록 체크되어 있습니다.

### 안전하게

- 드라이버와 Windows 구성 요소는 목록에서 고를 수도 없습니다. `보기`로 확인만 할 수 있습니다.
- 보안·네트워크 프로그램의 체크를 풀면 학교 인터넷이나 업무 사이트를 쓰지 못할 수 있다고 알려 줍니다.
- 남길 프로그램이 설치된 폴더, 숨김 파일, 백신의 랜섬웨어 감시용 파일은 지우지 않습니다.
- 같은 회사 프로그램 하나만 지울 때도 남길 프로그램이 함께 쓰는 데이터 폴더는 남깁니다.
- 처리한 내용은 `%LOCALAPPDATA%\Malkkeum\기록` 폴더에 남습니다.

### 설치와 실행

1. 다운로드한 ZIP의 압축을 풀고 **Malkkeum.exe**를 실행합니다. 따로 설치할 것은 없습니다.
2. 관리자 권한을 묻는 창에서 **예**를 누릅니다.
3. 삭제한 파일은 휴지통에 남지 않습니다. **필요한 파일은 먼저 USB에 옮긴 뒤** 시작하세요. 자리를 옮기며 파일을 챙길 때는 [짐싸](/ko/software/jimssa/)를 함께 쓰면 편합니다.
4. 자동 제거를 지원하지 않는 프로그램은 제거 창이 뜹니다. 처음에 그 창만 눌러 주면 나머지는 자동으로 진행됩니다.

Windows에서 "PC 보호" 창이 뜨면 **추가 정보** → **실행**을 누릅니다. 백신이 실행을 막으면 예외로 등록한 뒤 다시 실행합니다.

Windows 자체가 고장 났다면 말끔 대신 `설정 > 시스템 > 복구 > PC 초기화`를 쓰세요.
