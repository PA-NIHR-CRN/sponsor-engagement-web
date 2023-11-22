import { authService } from '.'

describe('AuthService', () => {
  it('should export the auth service', () => {
    expect(authService.getUser).toBeDefined()
    expect(authService.createUser).toBeDefined()
  })
})
