<!-- PostgreSQL 데이터베이스 스키마 -->

## 테이블 정의

### Users Table (사용자 정보)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table (게시글)
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

## 관계도

```
Users (1) ──── (Many) Posts
  id            author_id → users.id
```

## ERD (Entity Relationship Diagram)

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (UUID, PK)    │
│ email (VARCHAR)  │
│ username (VAR)   │
│ password (VAR)   │
│ bio (TEXT)       │
│ created_at       │
│ updated_at       │
└──────────────────┘
         │ (1)
         │
         ├──────────────┐
         │              │
    (Many)          (Future)
         │              │
         │              └── Comments
    ┌────────────────────┐
    │      POSTS         │
    ├────────────────────┤
    │ id (UUID, PK)      │
    │ title (VARCHAR)    │
    │ content (TEXT)     │
    │ author_id (FK)     │
    │ views (INTEGER)    │
    │ created_at         │
    │ updated_at         │
    └────────────────────┘
```
