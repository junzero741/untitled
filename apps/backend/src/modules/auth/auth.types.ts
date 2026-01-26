/**
 * Auth-related types are defined in the shared package so that
 * all applications (backend, frontend, etc.) rely on a single
 * source of truth for these contracts.
 *
 * We re-export them here to preserve existing import paths in
 * the backend while avoiding type duplication and drift.
 */
export {
  JwtPayload,
  LoginResponse,
  SignUpRequest,
  LoginRequest,
} from '@bulletin-board/shared'
