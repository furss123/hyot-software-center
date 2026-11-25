# 프로그램 추가하기

프로그램 하나 = 폴더 하나입니다.

```
src/content/software/
  hyoexam/          ← 폴더 이름이 주소가 됩니다: hyot.dev/ko/software/hyoexam/
    index.md        ← 정보 + 본문 (docs/software-template/index.md 복사해서 시작)
    icon.png        ← 아이콘
    main.png        ← 스크린샷
```

1. `docs/software-template/` 폴더를 `src/content/software/<영문소문자-이름>/`으로 복사합니다.
2. `index.md` 맨 위 `---` 사이의 정보를 채우고, 아래에 소개 글을 씁니다.
3. 아이콘·스크린샷 이미지를 같은 폴더에 넣습니다. (없으면 이니셜 아이콘이 자동으로 표시됩니다)
4. 목록과 상세 페이지에 표지를 표시하려면 이미지를 같은 폴더에 넣고 `cover: ./cover.webp`처럼 지정합니다.
5. main 브랜치에 올리면 1~2분 뒤 hyot.dev에 반영됩니다.

## 새 버전 올리기

`releases:` 맨 위에 항목을 하나 추가합니다. 홈의 버전 표시, 상세 페이지의 다운로드 정보,
자동 업데이트 확인 파일(`/updates/<폴더이름>.json`)이 모두 여기서 자동으로 만들어집니다.

## 설치 파일은 어디에?

이 저장소의 GitHub Releases에 올리고 그 주소를 `url`에, 태그를 `tag`에 적습니다.
설치 파일을 `public/` 아래에 넣지 마세요. 배포할 때마다 함께 올라가 사이트 용량 한도(1GB)를 채우고 저장소가 커집니다.

```bash
gh release create <이름>-v1.2.3 파일.zip --title "<이름> 1.2.3" --notes-file notes.md --latest=false
```

`--latest=false`는 "오늘 학교"가 Latest 릴리스로 남게 합니다. 오늘 학교 릴리스만 Latest로 둡니다.

## 로컬에서 미리 보기

```bash
npm install
npm run dev     # http://localhost:4321/ko/
```
