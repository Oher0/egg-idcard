# egg-idcard

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-idcard.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-idcard
[travis-image]: https://img.shields.io/travis/eggjs/egg-idcard.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-idcard
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-idcard.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-idcard?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-idcard.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-idcard
[snyk-image]: https://snyk.io/test/npm/egg-idcard/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-idcard
[download-image]: https://img.shields.io/npm/dm/egg-idcard.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-idcard

<!--
Description here.
-->

## Install

```bash
$ npm i egg-idcard --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.idcard = {
  enable: true,
  package: 'egg-idcard',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.idcard = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

### 身份证有效性验证

```node
this.app.idcard.verify('123456789');
// {"valid":false, "msg":"请检查身份证号码格式是否合法"}
this.app.idcard.verify('330102199001206292');
// {"valid":false, "msg":"身份证号码18位校验位错误"}
this.app.idcard.verify('330102199001206293');
// {"valid":true,"msg":""}
```

### 身份证号码信息提取

```node
this.app.idcard.info('330102199001206293');
// {"valid":true,"msg":"","area":{"province":{"code":"330000","name":"浙江省"},"city":{"code":"330100","name":"杭州市"},"district":{"code":"330102","name":"上城区"}},"birthday":"19900120","age":29,"gender":"M"}
```

### 随机生成身份证号码

```node
this.app.idcard.random();
// 330102199001206293
```

### 城市编码转换2017版

```node
this.app.idcard.area('330102');
// {"province":{"code":"330000","name":"浙江省"},"city":{"code":"330100","name":"杭州市"},"district":{"code":"330102","name":"上城区"}}
```

### 15位身份证号码补全

```node
this.app.idcard.repair('330102900120629');
// 330102199001206293
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
