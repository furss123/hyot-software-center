---
name: hwp2pdf
tagline: 한글(HWP·HWPX) 문서를 끌어다 놓으면 PDF로 바꿔 주는 변환기
tagline_en: Drag in HWP or HWPX documents and get PDFs back
description_en: |-
  hwp2pdf converts Hancom Hangul documents (HWP and HWPX) to PDF on Windows, using the Hangul program already installed on your PC.

  Drop files or whole folders onto the window, choose the image quality and page range, and convert them all at once. Existing PDFs are never overwritten, and your last settings are remembered.

  Requires Windows, Hancom Office Hangul and Python 3.12 or later. On first launch, run run.bat so the required packages are installed automatically.
category: document
platforms: [windows]
icon: ./icon.png
screenshots: [./done.png, ./working.png]
requirements: [Windows, 한컴오피스 한글, Python 3.12 이상]
order: 1
releases:
  - version: 1.0.0
    date: 2026-11-16
    channel: stable
    notes:
      - 첫 공개 버전
    downloads:
      - type: portable
        label: 압축 파일
        filename: hwp2pdf_1.0.0.zip
        url: /downloads/hwp2pdf/hwp2pdf_1.0.0.zip
        size: 17892
        sha256: 4dd10820cf6a20175554edb7c53dd4a8ff39d4259faa9c52f6b5569e6b5e3514
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

## 처음 실행하기

1. 압축을 풉니다.
2. **run.bat**을 더블클릭합니다. 처음 한 번은 필요한 구성 요소를 자동으로 설치하느라 창이 뜨기까지 조금 걸립니다.
3. 다음부터는 **run.bat** 또는 **hwp2pdf.vbs**를 더블클릭하면 바로 열립니다.

## 필요한 환경

- Windows와 한컴오피스 한글
- [Python 3.12 이상](https://www.python.org/downloads/windows/) — 설치할 때 "Add python.exe to PATH"를 체크해 주세요.
