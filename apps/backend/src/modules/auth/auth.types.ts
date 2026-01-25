export interface JwtPayload {
  sub: string
  email: string
  username: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    username: string
  }
}

export interface SignUpRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
