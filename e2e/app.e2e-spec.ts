import { KidazzlerUiPage } from './app.po';

describe('kidazzler-ui App', () => {
  let page: KidazzlerUiPage;

  beforeEach(() => {
    page = new KidazzlerUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
