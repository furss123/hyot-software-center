---
# ── 필수 ──────────────────────────────────
name: HyoSample                 # 영문 이름 (영어 페이지·주소에 쓰임)
tagline: 이 프로그램이 하는 일을 한 줄로

# ── 선택 ──────────────────────────────────
name_ko: 효샘플                  # 한국어 페이지에서 보일 이름
tagline_en: What it does, in one line
category: classroom             # classroom | system | media | document | image | etc
platforms: [windows]            # windows | android | web
icon: ./icon.png                # 같은 폴더에 둔 정사각형 이미지 (256px 이상 권장)
screenshots: [./main.png]       # 여러 장 가능
requirements: [Windows 10 이상, 64비트]
repo: https://github.com/furss123/hyosample
order: 10                       # 작을수록 목록 위쪽
draft: false                    # true면 사이트에 안 보임

releases:                       # 새 버전은 맨 위에 추가
  - version: 1.0.0
    date: 2026-11-16
    channel: stable             # stable | beta
    tag: v1.0.0
    notes:
      - 첫 공개 버전
    downloads:
      - type: installer         # installer | portable | msi | apk | store | other
        url: https://github.com/furss123/hyosample/releases/download/v1.0.0/HyoSample_1.0.0_x64-setup.exe
        size: 3104000           # 바이트 수(숫자) 또는 "3 MB" 같은 글자
        sha256: ""              # 선택
---

여기부터는 상세 페이지 본문입니다. 마크다운으로 자유롭게 씁니다.

## 주요 기능

- 기능 하나
- 기능 둘
