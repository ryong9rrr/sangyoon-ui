const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();

beforeEach(() => {
  dom.window.document.body.innerHTML = `<!DOCTYPE html><div id="root"></div>`;
  global.window = dom.window;
});
