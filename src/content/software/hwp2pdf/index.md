---
name: Moagyeol PDF
name_ko: 모아결 PDF
tagline: 한글 문서를 PDF로 변환하고, PDF를 합치거나 용량을 줄이는 도구
tagline_en: Convert Hangul documents to PDF, and merge or compress PDFs
description_en: |-
  Moagyeol PDF converts HWP and HWPX documents using the copy of Hancom Office Hangul installed on your Windows PC. Choose the pages and image quality, then save the PDFs to the source folder or a folder of your choice.

  Merge two or more PDF files in the order you choose. The merge tool runs without Hancom Office Hangul. When a destination file already exists, the app saves a new file with a numbered name.

  Compress one PDF or a batch with five levels, from lossless to smallest file size. Compare file sizes before and after compression. The app saves smaller copies alongside the originals or in a folder of your choice and keeps PDF text searchable.

  Download the ZIP, extract the entire folder, and run 모아결 PDF.exe. The app interface is in Korean.
category: document
platforms: [windows, web]
web: moagyeol-pdf
page_slug: moagyeol-pdf
icon: ./icon.png
cover: ./cover.webp
screenshots: [./convert.png, ./merge.png, ./complete.png, ./compress.png]
screenshot_titles: [한글 파일 변환, 합칠 PDF 추가, 합치기 완료, PDF 압축 결과]
screenshot_titles_en: [Convert Hangul files, Add PDFs to merge, Merge results, PDF compression results]
requirements: [Windows 64비트]
requirements_en: [Windows 64-bit]
order: 1
releases:
  - version: 1.2.0
    date: 2026-11-23
    channel: stable
    tag: moagyeol-pdf-v1.2.0
    notes:
      - 무손실부터 최소 용량까지 5단계를 고를 수 있는 PDF 용량 줄이기 탭을 추가했습니다.
      - 여러 PDF를 한 번에 압축하고 파일별 압축 전후 용량과 감소율을 표시합니다.
      - 원본은 보관하고 용량이 줄어든 PDF를 별도 파일로 저장합니다.
    notes_en:
      - Added a PDF compression tab with five levels from lossless to smallest.
      - Compress multiple PDFs at once and compare file sizes and savings for each file.
      - Keep the originals and save smaller PDFs as separate files.
    downloads:
      - type: portable
        filename: moagyeol-pdf_1.2.0_x64.zip
        url: https://github.com/furss123/hyot-software-center/releases/download/moagyeol-pdf-v1.2.0/moagyeol-pdf_1.2.0_x64.zip
        size: 27723497
        sha256: 281551c7f2dd842380d09da52d04d5b155427a930eec63b3bb45b103af7445c2
        arch: x64
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
  - version: 1.0.0
    date: 2026-11-16
    channel: stable
    notes:
      - 첫 공개 버전
---

모아결 PDF는 한글(HWP·HWPX) 문서를 PDF로 변환하고, 기존 PDF를 순서대로 합치거나 용량을 줄이는 Windows 프로그램입니다. 설치 없이 쓰는 [웹 도구](/ko/moagyeol-pdf/)도 있습니다.

### 한글 문서를 PDF로 변환

- HWP·HWPX 파일이나 폴더를 창에 끌어다 놓습니다. **파일 추가**, **폴더 추가** 버튼으로도 선택할 수 있습니다.
- 원본 품질을 유지하거나 JPEG 이미지를 압축할 수 있습니다. PDF의 텍스트 검색과 선택은 그대로 가능합니다.
- 전체 페이지를 변환하거나 `1-3, 5, 8-10`처럼 원하는 페이지만 골라 저장합니다.
- 한글 문서를 변환하려면 PC에 한컴오피스 한글이 설치되어 있어야 합니다.

### 여러 PDF 합치기

- PDF를 두 개 이상 추가하고 행의 화살표, **이름순**, **순서 뒤집기**로 순서를 조절합니다. 목록 위쪽부터 합쳐집니다.
- PDF 합치기는 한컴오피스 한글 없이 사용할 수 있습니다.
- 저장할 때 같은 이름의 PDF가 있으면 `이름 (1).pdf`처럼 새 파일을 만듭니다.

### PDF 용량 줄이기

- PDF 파일이나 폴더를 추가하고 압축 단계를 선택하세요. **1 무손실**, **2 고화질**, **3 균형**, **4 작게**, **5 최소 용량** 중에서 고를 수 있습니다.
- 압축 전후 용량과 감소율을 확인할 수 있습니다. 작아진 파일은 원본 폴더나 선택한 폴더에 `이름_압축.pdf`로 별도 저장합니다.
- PDF의 텍스트를 검색하고 선택할 수 있습니다. 2~5단계는 지원하는 사진과 스캔 이미지의 화질을 조절하며, 줄어드는 용량은 문서마다 다릅니다.

### 설치와 실행

다운로드한 ZIP의 압축을 풀고 **모아결 PDF.exe**를 더블클릭합니다. 다른 곳으로 옮길 때는 `_internal`을 포함한 폴더 전체를 복사하세요.
