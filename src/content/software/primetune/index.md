---
name: PrimeTune
tagline: 업무용·게임용 PC를 원클릭으로 최적화하는 도구
tagline_en: Optimize your work or gaming PC in one click
description_en: |-
  PrimeTune tunes Windows settings, cleans junk files and manages startup programs. Choose one-click Work optimization for office and administrative PCs, or Game optimization for gaming PCs.

  Work optimization speeds up File Explorer and Office, turns on clipboard history and blocks update restarts during work hours. It keeps search, printing, notifications, security features and internal network DNS unchanged.

  Every change is backed up first. Revert one item, only the risky items, or everything with one click. PrimeTune can also create a system restore point before it applies changes.

  Download the ZIP, extract the entire folder, and run PrimeTune.exe. The app asks for administrator rights. The app interface is in Korean.
category: system
platforms: [windows]
icon: ./icon.png
screenshots: [./dashboard.png, ./optimize.png, ./clean.png, ./prefs.png]
screenshot_titles: [대시보드, 윈도우 최적화 74가지, 파일 청소, 환경 설정]
screenshot_titles_en: [Dashboard, 74 Windows optimizations, File cleanup, Quick settings]
requirements: [Windows 10(1903 이상)·11, 64비트, 관리자 권한]
requirements_en: [Windows 10 (1903 or later) or 11, 64-bit, Administrator rights]
order: 4
releases:
  - version: 1.0.2
    date: 2026-11-25
    channel: stable
    tag: primetune-v1.0.2
    notes:
      - 실행하면 바로 관리자 권한을 요청하고, 처음부터 관리자 권한으로 실행됩니다.
      - 시작 프로그램 지연 실행이 관리자 권한 없이도 동작하도록 바꿨습니다. 이전 설정은 자동으로 옮겨집니다.
    notes_en:
      - The app now asks for administrator rights on launch and runs elevated from the start.
      - Delayed startup programs now launch without administrator rights. Existing settings move over automatically.
    downloads:
      - type: portable
        filename: PrimeTune_1.0.2_x64.zip
        url: https://github.com/furss123/hyot-software-center/releases/download/primetune-v1.0.2/PrimeTune_1.0.2_x64.zip
        size: 41655466
        sha256: b668db188553eb4c281fca0ac6bdc7bda64e323d991e5a6652cbca46a5dd1e4c
        arch: x64
  - version: 1.0.1
    date: 2026-11-25
    channel: stable
    notes:
      - 자동화 화면에서 '지금 메모리 정리'를 누르면 오류 창이 뜨던 문제를 고쳤습니다.
      - 관리자 권한 없이 실행하면 오류 대신 권한이 필요하다고 안내합니다.
    notes_en:
      - Fixed an error dialog when clicking Clean memory now on the Automation page.
      - Without administrator rights, the app now explains that rights are needed instead of showing an error.
  - version: 1.0.0
    date: 2026-11-25
    channel: stable
    notes:
      - 첫 공개 버전
      - 원클릭 업무 최적화와 게임 최적화를 나눠 적용할 수 있습니다.
    notes_en:
      - First public release
      - Separate one-click Work and Game optimization.
---

PrimeTune은 Windows 설정, 불필요한 파일, 시작 프로그램을 정리해 PC를 가볍게 만드는 Windows 최적화 프로그램입니다. 업무용 PC와 게임용 PC에 맞는 최적화를 버튼 하나로 적용할 수 있습니다.

### 원클릭 업무 최적화·게임 최적화

- **업무 최적화**는 문서·한글·엑셀·브라우저·행정 시스템을 쓰는 PC에 맞춥니다. 탐색기와 Office 실행을 빠르게 하고, 클립보드 기록(Win+V)을 켜고, 업무 시간(08~18시)에는 업데이트 자동 재시작을 막습니다.
- 업무 최적화는 파일·메일 검색, 인쇄, 알림, 보안 기능, 기관 내부망 DNS를 바꾸지 않습니다. 이전에 꺼 둔 검색·인쇄 같은 항목은 원래대로 되돌립니다.
- **게임 최적화**는 게임 모드, 작업 스케줄링, 전원 계획, 네트워크 지연, 입력 버퍼를 조정합니다.

### 윈도우 최적화 74가지

- 항목마다 **안전**, **주의**, **위험**을 표시하고 어떤 설정을 바꾸는지 설명합니다.
- 바꾸기 전에 원래 값을 자동으로 백업합니다. 항목별 **되돌리기**, **위험 항목 되돌리기**, **기본값 복원**으로 언제든 되돌릴 수 있습니다.
- 최적화 전에 시스템 복원 지점을 만들 수 있습니다.
- **고급 최적화 설정**에서 CPU 스케줄링, 입력 버퍼, 네트워크 스로틀링, DNS 등 6가지 값을 직접 조정합니다.

### 파일 청소·중복 파일 찾기

- 임시 파일, Windows 업데이트 캐시, 브라우저 캐시, 게임 런처·메신저 캐시 등 49가지를 정리합니다. 쿠키와 로그인 정보, 문서·사진·다운로드 파일은 지우지 않습니다.
- 내용이 완전히 같은 중복 파일을 찾아 휴지통으로 옮깁니다.

### 시스템 검사·시작 프로그램·앱 제거

- 15개 영역 65가지 항목으로 PC 상태를 점검하고, 안전한 항목은 자동으로 복구합니다. 결과는 HTML 리포트로 저장할 수 있습니다.
- 시작 프로그램의 영향도를 보고 끄거나, 로그인 후 몇 초 뒤에 실행되도록 미룹니다.
- 설치된 앱과 Windows 기본 앱을 확인하고 필요 없는 앱을 제거합니다. 시스템 필수 앱은 보호됩니다.

### 자동화

- 정해 둔 주기마다 최적화 상태를 점검하고 파일을 청소합니다. 결과 리포트를 메일로 받을 수 있습니다.
- 여유 메모리가 부족하면 대기 메모리를 자동으로 비웁니다.

### 설치와 실행

다운로드한 ZIP의 압축을 풀고 **PrimeTune.exe**를 더블클릭합니다. 관리자 권한을 묻는 창에서 **예**를 누르세요. 다른 곳으로 옮길 때는 `_internal`을 포함한 폴더 전체를 복사하세요.

Windows에서 "PC 보호" 창이 뜨면 **추가 정보** → **실행**을 누릅니다. 일부 최적화 항목은 재부팅한 뒤 적용됩니다.
