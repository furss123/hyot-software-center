---
name: Chaja
tagline: 파일 이름을 입력하는 즉시 찾아 주는 한글 파일 검색 도구
tagline_en: Find files by name as you type, built for Korean
description_en: |-
  Chaja finds files and folders by name as you type. On NTFS drives it reads the drive's file table directly, so indexing takes only a few seconds and changes appear in real time.

  It is built for Korean. Search by initial consonants (ㅎㄱ finds 한글), get results while a syllable is still being composed, match decomposed (NFD) file names from a Mac or ZIP files, and recover from typing with the wrong keyboard layout (gksrmf finds 한글).

  Windows folders, temp folders, the Recycle Bin and developer caches are excluded by default, and hidden folders such as AppData stay hidden, so results stay clean. There are only six settings.

  Requires the .NET 10 Desktop Runtime. Extract the ZIP and run Chaja.exe. The app interface is in Korean.
category: system
platforms: [windows]
icon: ./icon.png
screenshots: [./main.png, ./light.png, ./settings.png]
screenshot_titles: [이름으로 바로 찾기, 초성 검색 · 밝은 테마, 설정]
screenshot_titles_en: [Instant search by name, Initial-consonant search in light theme, Settings]
requirements: [Windows 10·11 64비트, .NET 10 데스크톱 런타임]
requirements_en: [Windows 10 or 11, 64-bit, .NET 10 Desktop Runtime]
order: 5
releases:
  - version: 1.1.0
    date: 2026-11-25
    channel: stable
    notes:
      - 첫 공개 버전
      - 초성 검색, 한/영 전환 실수 보정, 조합 중인 글자 검색을 지원합니다.
      - Windows 11 스타일 화면과 다크·라이트 테마를 지원합니다.
    notes_en:
      - First public release
      - Initial-consonant search, wrong keyboard layout recovery, and search while composing Korean.
      - Windows 11 style interface with dark and light themes.
    downloads:
      - type: portable
        filename: Chaja-1.1.0-win-x64.zip
        url: /downloads/chaja/Chaja-1.1.0-win-x64.zip
        size: 259322
        sha256: 0222f758d86cdb25e9478a93f499fecf04b668f6a2e9a795f7f7af22a7f2e240
        arch: x64
---

Chaja(찾자)는 파일·폴더 이름을 입력하는 순간 결과를 보여 주는 Windows 파일 검색 프로그램입니다. 실행 파일 하나(약 440KB)로 동작하고, 한글 파일 이름을 제대로 찾는 데 집중했습니다.

### 입력하는 순간 찾기

- 관리자 권한으로 실행하면 NTFS 드라이브의 파일 목록을 직접 읽어 수십만 개를 몇 초 만에 색인합니다.
- 파일을 만들거나 이름을 바꾸거나 지우면 1초 안에 결과에 반영됩니다.
- 이름이 그대로 맞는 것, 앞부분이 맞는 것 순서로 보여 주고, 같으면 최근에 고친 파일이 위로 옵니다. 자주 연 파일도 위로 올라옵니다.
- 검색어를 비우면 최근에 바뀐 파일을 보여 줍니다.

### 한글 검색

- **초성 검색**: `ㅎㄱ`으로 한글·학교·회계를 찾고, `한ㄱ`처럼 섞어 써도 됩니다.
- **조합 중인 글자**: `한`을 치는 도중의 `하`로도 결과가 바로 바뀝니다.
- **한/영 전환 실수 보정**: 영문 상태로 친 `gksrmf`를 `한글`로 다시 찾아 줍니다.
- 맥이나 압축 파일에서 온, 자모가 분리된 파일 이름도 찾습니다.

### 잡다한 결과 없이

- Windows 폴더, 임시 폴더, 휴지통, `node_modules`·`.git` 같은 개발 캐시는 기본으로 뺍니다.
- AppData 같은 숨김 폴더 속 파일은 기본으로 숨깁니다.
- 설정은 검색할 드라이브, 제외할 폴더, 숨김 파일 표시, 단축키, 자동 실행, 테마 6가지뿐입니다.

### 검색 문법

| 입력 | 뜻 |
|---|---|
| `보고서 2026` | 두 단어 모두 포함 |
| `ext:pdf;hwp` | 확장자 |
| `*.hwp` | 와일드카드 |
| `!초안` | 제외 |
| `프로젝트\보고서` | 경로에 포함 |

### 단축키

- `Ctrl+Alt+F`: 어디서든 검색창 열기·닫기 (설정에서 바꿀 수 있음)
- `Enter` 열기 · `Ctrl+Enter` 파일 위치 열기 · `Alt+Enter` 속성
- `Ctrl+C` 파일 복사 · `Ctrl+Shift+C` 경로 복사 · 끌어다 놓기 지원
- `Ctrl+1`~`Ctrl+8`: 전체·폴더·문서·이미지·동영상·음악·압축·실행 파일

### 설치와 실행

1. [.NET 10 데스크톱 런타임](https://dotnet.microsoft.com/download/dotnet/10.0)이 없다면 먼저 설치합니다. (없으면 실행할 때 설치 안내가 나옵니다)
2. 다운로드한 ZIP의 압축을 풀고 **Chaja.exe**를 실행합니다.
3. 관리자 권한을 묻는 창에서 **예**를 누르면 빠른 모드로 동작합니다. **아니요**를 누르면 폴더를 직접 훑는 일반 모드로 동작합니다(색인이 조금 느림).

관리자 권한으로 실행 중이어도 파일은 일반 권한으로 열립니다. 설정에서 **시작할 때 자동 실행**을 켜 두면 부팅 후 확인 창 없이 트레이에서 조용히 시작합니다.

Windows에서 "PC 보호" 창이 뜨면 **추가 정보** → **실행**을 누릅니다.
