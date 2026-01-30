# Production Deployment Guide

## 배포 개요

이 프로젝트는 Docker와 Docker Compose를 사용하여 프로덕션 환경에 배포할 수 있습니다.

## 사전 요구사항

배포하기 전에 다음 소프트웨어가 설치되어 있어야 합니다:

- Docker (v20.10 이상)
- Docker Compose (v2.0 이상)

## 배포 단계

### 1. 환경 변수 설정

`.env.production.example` 파일을 복사하여 `.env.production` 파일을 생성합니다:

```bash
cp .env.production.example .env.production
```

`.env.production` 파일을 열어 프로덕션 환경에 맞게 값을 수정합니다:

```env
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password
DB_NAME=bulletin_board_prod
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_min_32_characters

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Server Ports
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

**중요 사항:**
- `JWT_SECRET`은 최소 32자 이상의 안전한 랜덤 문자열을 사용하세요
- `DB_PASSWORD`는 강력한 비밀번호를 설정하세요
- `ALLOWED_ORIGINS`에는 실제 프론트엔드 도메인을 입력하세요
- `NEXT_PUBLIC_API_URL`에는 백엔드 API의 실제 URL을 입력하세요

### 2. 자동 배포 스크립트 사용

배포 스크립트를 실행 가능하도록 만듭니다:

```bash
chmod +x deploy.sh
```

배포 스크립트를 실행합니다:

```bash
./deploy.sh
```

이 스크립트는 다음 작업을 자동으로 수행합니다:
1. 환경 변수 파일 확인
2. Docker 이미지 빌드
3. 서비스 시작
4. 서비스 상태 확인

### 3. 수동 배포 (선택사항)

자동 스크립트를 사용하지 않고 수동으로 배포하려면:

```bash
# Docker 이미지 빌드
docker-compose -f docker-compose.prod.yml --env-file .env.production build

# 서비스 시작
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 배포 후 확인

### 서비스 상태 확인

```bash
docker-compose -f docker-compose.prod.yml ps
```

### 로그 확인

모든 서비스의 로그 확인:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

특정 서비스의 로그만 확인:
```bash
# Frontend 로그
docker-compose -f docker-compose.prod.yml logs -f frontend

# Backend 로그
docker-compose -f docker-compose.prod.yml logs -f backend

# Database 로그
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### 서비스 접속

- **Frontend**: `http://localhost:3000` (또는 설정한 FRONTEND_PORT)
- **Backend API**: `http://localhost:3001` (또는 설정한 BACKEND_PORT)

## 서비스 관리

### 서비스 재시작

```bash
docker-compose -f docker-compose.prod.yml restart
```

특정 서비스만 재시작:
```bash
docker-compose -f docker-compose.prod.yml restart frontend
```

### 서비스 중지

```bash
docker-compose -f docker-compose.prod.yml stop
```

### 서비스 종료 및 컨테이너 제거

```bash
docker-compose -f docker-compose.prod.yml down
```

데이터베이스 볼륨까지 제거하려면:
```bash
docker-compose -f docker-compose.prod.yml down -v
```

⚠️ **주의**: `-v` 옵션을 사용하면 데이터베이스 데이터가 모두 삭제됩니다.

### 이미지 재빌드

코드 변경 후 이미지를 다시 빌드하려면:

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 프로덕션 환경 구성

### 아키텍처

```
┌─────────────┐
│   Frontend  │ (Port 3000)
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTP
       │
┌──────▼──────┐
│   Backend   │ (Port 3001)
│  (Nest.js)  │
└──────┬──────┘
       │
       │ PostgreSQL
       │
┌──────▼──────┐
│  PostgreSQL │ (Port 5432)
│  Database   │
└─────────────┘
```

### 네트워크

모든 서비스는 `bulletin-board-network` 브리지 네트워크에서 실행됩니다. 이를 통해 서비스 간 통신이 가능합니다.

### 볼륨

- `postgres_data`: PostgreSQL 데이터 영구 저장

## 보안 고려사항

1. **환경 변수**: `.env.production` 파일은 절대 Git에 커밋하지 마세요
2. **JWT Secret**: 강력한 랜덤 문자열을 사용하세요
3. **Database Password**: 복잡한 비밀번호를 설정하세요
4. **CORS**: `ALLOWED_ORIGINS`를 실제 프론트엔드 도메인으로만 제한하세요
5. **방화벽**: 필요한 포트만 열어두세요
6. **HTTPS**: 프로덕션에서는 반드시 HTTPS를 사용하세요 (Nginx 리버스 프록시 권장)

## 클라우드 배포

### AWS EC2

1. EC2 인스턴스 생성 (Ubuntu 22.04 LTS 권장)
2. Docker 및 Docker Compose 설치
3. 보안 그룹에서 포트 3000, 3001 허용
4. 코드를 EC2에 클론
5. 위의 배포 단계 실행

### DigitalOcean Droplet

1. Droplet 생성 (Docker 이미지 선택 권장)
2. 코드를 Droplet에 클론
3. 위의 배포 단계 실행

### Docker Hub를 통한 배포

이미지를 Docker Hub에 푸시하여 어디서나 배포할 수 있습니다:

```bash
# 이미지 빌드 및 태그
docker build -t yourusername/bulletin-board-frontend:latest -f apps/frontend/Dockerfile .
docker build -t yourusername/bulletin-board-backend:latest -f apps/backend/Dockerfile .

# Docker Hub에 푸시
docker push yourusername/bulletin-board-frontend:latest
docker push yourusername/bulletin-board-backend:latest
```

## 트러블슈팅

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 특정 서비스 로그
docker-compose -f docker-compose.prod.yml logs backend
```

### 데이터베이스 연결 실패

1. PostgreSQL 컨테이너가 실행 중인지 확인
2. `.env.production`의 데이터베이스 설정 확인
3. 데이터베이스 헬스체크 확인

### 포트 충돌

이미 사용 중인 포트가 있다면 `.env.production`에서 포트 번호를 변경하세요.

## 모니터링

프로덕션 환경에서는 다음과 같은 모니터링 도구를 추가로 설정하는 것을 권장합니다:

- **로깅**: ELK Stack, Loki
- **모니터링**: Prometheus, Grafana
- **APM**: New Relic, DataDog

## 백업

정기적으로 데이터베이스 백업을 수행하세요:

```bash
# PostgreSQL 백업
docker exec bulletin-board-postgres-prod pg_dump -U your_db_username bulletin_board_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# 백업 복원
docker exec -i bulletin-board-postgres-prod psql -U your_db_username bulletin_board_prod < backup_file.sql
```

## 업데이트

새로운 코드를 배포하려면:

```bash
# 코드 업데이트
git pull origin main

# 이미지 재빌드 및 재시작
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## 도움말

문제가 발생하면 다음을 확인하세요:

1. Docker 및 Docker Compose 버전
2. 환경 변수 설정
3. 네트워크 연결
4. 로그 파일
5. 방화벽 설정

추가 지원이 필요하면 프로젝트 저장소의 Issues를 참조하세요.
