import { TextShorterPipe } from './wallet-address-shortener.pipe';

describe('WalletAddressShortenerPipe', () => {
  it('create an instance', () => {
    const pipe = new TextShorterPipe();
    expect(pipe).toBeTruthy();
  });
});
