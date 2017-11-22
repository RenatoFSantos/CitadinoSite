import { CitadinoPage } from './app.po';

describe('citadino App', () => {
  let page: CitadinoPage;

  beforeEach(() => {
    page = new CitadinoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
