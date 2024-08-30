import { authService } from '.'

describe('AuthService', () => {
  it('should export the auth service', () => {
    expect(authService.getUser).toBeDefined()
    expect(authService.createUser).toBeDefined()
    expect(authService.assignWSO2UserRole).toBeDefined()
    expect(authService.removeWSO2UserRole).toBeDefined()
  })
})
