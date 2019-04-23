'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/idcard.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/idcard-test',
      plugin: true,
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('Idcard Test', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, idcard')
      .expect(200);
  });

  it('Verify success', () => {
    return app.httpRequest()
      .get('/verify/330102199001206293')
      .type('json')
      .expect('{"valid":true,"msg":""}')
      .expect(200);
  });

  it('Verify parse error', () => {
    return app.httpRequest()
      .get('/verify/330102290001206293')
      .type('json')
      .expect('{"valid":false,"msg":"请检查身份证号码格式是否合法"}')
      .expect(200);
  });

  it('Verify parity error', () => {
    return app.httpRequest()
      .get('/verify/330102199001206292')
      .type('json')
      .expect('{"valid":false,"msg":"身份证号码18位校验位错误"}')
      .expect(200);
  });

  it('Info success', async () => {
    const json = await app.httpRequest()
      .get('/info/330102199001206293')
      .type('json')
      .expect(200);
    const ret = JSON.parse(json.text);
    // console.log(json.text);
    assert(json.status === 200);
    assert(ret.valid === true);
    assert(ret.birthday === '19900120');
    assert(ret.area.province.name === '浙江省');
    assert(ret.area.city.name === '杭州市');
    assert(ret.area.district.name === '上城区');
    assert(ret.age === 29);
    assert(ret.gender === 'M');
    return;
  });

  it('Random ID', async () => {
    const json = await app.httpRequest()
      .get('/rand')
      .expect(200);
    // console.log(json.text);
    const info = await app.httpRequest()
      .get('/info/' + json.text)
      .type('json')
      .expect(200);
    const ret = JSON.parse(info.text);
    // console.log(info.text);
    assert(info.status === 200);
    assert(ret.valid === true);
    return;
  });

});
