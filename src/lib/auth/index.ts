export interface AuthAdapter {
  getToken(): Promise<string>
  isAuthenticated(): Promise<boolean>
}
