---
name: hwp2pdf
tagline: 한글(HWP·HWPX) 문서를 끌어다 놓으면 PDF로 바꿔 주는 변환기
tagline_en: Drag in HWP or HWPX documents and get PDFs back
description_en: |-
  hwp2pdf converts Hancom Hangul documents (HWP and HWPX) to PDF on Windows, using the Hangul program already installed on your PC.

  Drop files or whole folders onto the window, choose the image quality and page range, and convert them all at once. Existing PDFs are never overwritten, and your last settings are remembered.

  Requires Windows and Hancom Office Hangul. Unzip the download and run hwp2pdf.exe — nothing else to install.
category: document
platforms: [windows]
icon: ./icon.png
screenshots: [./done.png, ./working.png]
requirements: [Windows 64비트, 한컴오피스 한글]
order: 1
releases:
  - version: 1.0.0
    date: 2026-11-16
    channel: stable
    notes:
      - 첫 공개 버전
    downloads:
      - type: portable
        filename: hwp2pdf_1.0.0_x64.zip
        url: /downloads/hwp2pdf/hwp2pdf_1.0.0_x64.zip
        size: 96055992
        sha256: cc0e6e5ab56ddf7a9103558f292e5e725b93b38b0a14303f67fb510d9bc0c982
        arch: x64
---

PC에 설치된 한컴오피스 한글을 이용해 HWP·HWPX 문서를 PDF로 바꿉니다. 여러 파일이나 폴더를 한꺼번에 넣고 버튼 한 번으로 변환합니다.

## 할 수 있는 일

- 파일이나 폴더를 창에 끌어다 놓거나 [파일 추가]·[폴더 추가]로 한꺼번에 넣기
- 화질 고르기: 원본, 높음, 보통, 가볍게(메일·메신저 전송용)
- 전체 페이지 또는 `1-3, 5, 8-10`처럼 원하는 페이지만 변환
- 원본과 같은 폴더나 다른 폴더에 저장
- 같은 이름의 PDF가 있으면 덮어쓰지 않고 `이름 (1).pdf`로 저장
- 파일마다 진행 상태 표시, 변환 중 [중지] 가능
- 완료된 파일을 더블클릭하면 PDF가 있는 폴더 열기
- 마지막으로 쓴 설정 기억

## 실행하기

1. 내려받은 압축 파일을 새 폴더에 풉니다.
2. **hwp2pdf.exe**를 더블클릭합니다. 따로 설치할 것은 없습니다.

`_internal` 폴더는 실행에 필요한 파일이니 hwp2pdf.exe와 같은 곳에 그대로 두세요.

## 필요한 환경

- Windows 64비트
- 한컴오피스 한글
