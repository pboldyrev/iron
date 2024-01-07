import { DisplayNumberPipe } from './displayNumber.pipe';

describe('DisplayNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new DisplayNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
