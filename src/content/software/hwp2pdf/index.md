---
name: Moagyeol PDF
name_ko: 모아결 PDF
tagline: 한글 문서를 PDF로 변환하고 여러 PDF를 한 파일로 합치는 Windows 도구
tagline_en: Convert HWP and HWPX to PDF and merge PDFs on Windows
description_en: |-
  Moagyeol PDF converts HWP and HWPX documents using the copy of Hancom Office Hangul installed on your Windows PC. Choose the pages and image quality, then save the PDFs to the source folder or a folder of your choice.

  Merge two or more PDF files in the order you choose. The merge tool runs without Hancom Office Hangul. When a destination file already exists, the app saves a new file with a numbered name.

  Download the ZIP, extract the entire folder, and run 모아결 PDF.exe. The app interface is in Korean.
category: document
platforms: [windows]
icon: ./icon.png
cover: ./cover.webp
screenshots: [./convert.png, ./merge.png, ./complete.png]
requirements: [Windows 64비트]
requirements_en: [Windows 64-bit]
order: 1
releases:
  - version: 1.1.0
    date: 2026-11-23
    channel: stable
    notes:
      - 모아결 PDF로 이름을 바꾸고 새 아이콘과 문서·제본 이미지를 적용했습니다.
      - 여러 PDF를 원하는 순서대로 합치는 작업 화면을 추가했습니다.
      - JPEG 이미지 압축 후에도 PDF의 텍스트 검색과 선택을 유지합니다.
    notes_en:
      - Renamed to Moagyeol PDF with a new icon and custom document artwork.
      - Added PDF merging with file reordering.
      - JPEG image compression keeps PDF text searchable and selectable.
    downloads:
      - type: portable
        filename: moagyeol-pdf_1.1.0_x64.zip
        url: /downloads/hwp2pdf/moagyeol-pdf_1.1.0_x64.zip
        size: 27711519
        sha256: 45b804ebedec5974a477c312d2960e8ac75589fbb1d519964aba80f195351761
        arch: x64
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

모아결 PDF에서 한글 문서를 PDF로 변환하거나 기존 PDF를 순서대로 묶을 수 있습니다.

### 한글 문서를 PDF로 변환

- HWP·HWPX 파일이나 폴더를 창에 끌어다 놓습니다. **파일 추가**, **폴더 추가** 버튼으로도 선택할 수 있습니다.
- 원본 품질을 유지하거나 JPEG 이미지를 압축할 수 있습니다. PDF의 텍스트 검색과 선택은 그대로 가능합니다.
- 전체 페이지를 변환하거나 `1-3, 5, 8-10`처럼 원하는 페이지만 골라 저장합니다.
- 한글 문서를 변환하려면 PC에 한컴오피스 한글이 설치되어 있어야 합니다.

### 여러 PDF 합치기

- PDF를 두 개 이상 추가하고 행의 화살표, **이름순**, **순서 뒤집기**로 순서를 조절합니다. 목록 위쪽부터 합쳐집니다.
- PDF 합치기는 한컴오피스 한글 없이 사용할 수 있습니다.
- 저장할 때 같은 이름의 PDF가 있으면 `이름 (1).pdf`처럼 새 파일을 만듭니다.

### 실행하기

다운로드한 ZIP의 압축을 풀고 **모아결 PDF.exe**를 더블클릭합니다. 다른 곳으로 옮길 때는 `_internal`을 포함한 폴더 전체를 복사하세요.
