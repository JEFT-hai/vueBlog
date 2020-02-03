import { AuthStatePipe } from './auth-state.pipe';

describe('AuthStatePipe', () => {
  it('create an instance', () => {
    const pipe = new AuthStatePipe();
    expect(pipe).toBeTruthy();
  });
});
