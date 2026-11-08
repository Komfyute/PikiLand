# PikiLand

## 특징

- GitHub Actions에서 동작하는 실행 엔진
- 프로덕션 서버에서 로그 수집
- Harness & Ralph Loop 기반 자가 검증

## 로컬 실행

`.dev.vars`에 다음과 같은 변수가 설정되어 있어야 합니다.
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `JWT_SECRET`

실행
```
bun ci
bun run deploy
```

## 문서

자세한 설계, 아키텍쳐는 `docs/`를 참고하세요.
