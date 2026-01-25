/**
 * PostgreSQL 데이터베이스 스키마 설명
 *
 * 테이블 구조:
 *
 * 1. users 테이블
 *    - id (UUID, PK): 사용자 고유 ID
 *    - email (VARCHAR 255, UNIQUE): 사용자 이메일
 *    - username (VARCHAR 100, UNIQUE): 사용자 이름
 *    - password (VARCHAR 255): 해시된 비밀번호
 *    - bio (TEXT, NULL): 사용자 소개글
 *    - createdAt (TIMESTAMP): 생성 날짜
 *    - updatedAt (TIMESTAMP): 수정 날짜
 *
 * 2. posts 테이블
 *    - id (UUID, PK): 게시글 고유 ID
 *    - title (VARCHAR 255): 게시글 제목
 *    - content (TEXT): 게시글 내용 (WYSIWYG 에디터로 작성)
 *    - authorId (UUID, FK -> users.id): 작성자 ID
 *    - views (INT, DEFAULT 0): 조회수
 *    - createdAt (TIMESTAMP): 생성 날짜
 *    - updatedAt (TIMESTAMP): 수정 날짜
 *
 * 인덱스:
 *    - posts(authorId): 작성자별 조회 성능
 *    - posts(createdAt): 날짜별 조회 성능
 */

export const DATABASE_SCHEMA = {
  users: {
    tableName: 'users',
    columns: {
      id: 'uuid',
      email: 'varchar(255)',
      username: 'varchar(100)',
      password: 'varchar(255)',
      bio: 'text',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    },
  },
  posts: {
    tableName: 'posts',
    columns: {
      id: 'uuid',
      title: 'varchar(255)',
      content: 'text',
      authorId: 'uuid',
      views: 'integer',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    },
  },
}
