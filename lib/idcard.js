'use strict';

const province = require('./area/province');
const city = require('./area/city');
const district = require('./area/district');

class Idcard {
  verify(idno) {
    const ret = { valid: true, msg: '' };
    if (typeof idno !== 'string') idno += '';
    if (idno.length !== 18) { // 不做非18位身份证号码校验
      ret.valid = false;
      ret.msg = '请输入18位身份证号码';
      return ret;
    }
    if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(idno)) {
      ret.valid = false;
      ret.msg = '请检查身份证号码格式是否合法';
      return ret;
    }
    const code = idno.split('');
    // ∑(ai×Wi)(mod 11)
    // 加权因子
    const factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    // 校验位
    const parity = [ '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' ];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = code[i];
      wi = factor[i];
      sum += ai * wi;
    }
    const last = parity[sum % 11];
    if (last !== code[17]) {
      ret.msg = '身份证号码18位校验位错误';
      ret.valid = false;
    }
    return ret;
  }

  repair(idno) {
    if (typeof idno !== 'string') idno += '';
    if (idno.length === 18) return idno;
    if (idno.length !== 15) return false;
    const temIdno = idno.slice(0, 6) + '19' + idno.slice(6);
    const char = temIdno.split('');
    let last = 0;
    const factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    const parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    for (const i of char) {
      last += char[i] * factor[i];
    }
    const lastParity = parity[last % 11];
    return temIdno + lastParity;
  }

  info(idno) {
    if (typeof idno !== 'string') idno += '';
    if (idno.length !== 18) idno = this.repair(idno);
    if (!idno || idno.length !== 18) return false;
    const verify = this.verify(idno);
    if (!verify.valid) return verify;

    const info = {
      ...verify,
      area: this.area(idno.slice(0, 6)),
      birthday: idno.slice(6, 14),
      age: this.age(idno.slice(6, 14)),
      gender: (+idno.slice(16, 17) % 2 === 0) ? 'F' : 'M',
    };
    return info;
  }

  area(code) {
    if (typeof code !== 'string') code += '';
    if (code.length !== 6) return false;
    const provinceCode = code.slice(0, 2);
    const cityCode = code.slice(0, 4);
    const provinName = province[provinceCode] || 'unknown';
    const cityName = city[cityCode] || 'unknown';
    const districtName = district[code] || 'unknown';
    const area = {
      province: { code: provinceCode + '0000', name: provinName },
      city: { code: cityCode + '00', name: cityName },
      district: { code, name: districtName },
    };
    return area;
  }

  age(birthday) {
    if (typeof birthday !== 'string') birthday += '';
    if (birthday.length !== 8) return false;
    let age = -1;
    const birthYear = birthday.slice(0, 4);
    const birthMonth = birthday.slice(4, 6);
    const birthDay = birthday.slice(6, 8);

    const d = new Date();
    const nowYear = d.getFullYear();
    const nowMonth = d.getMonth() + 1;
    const nowDay = d.getDate();
    if (nowYear === birthYear) {
      age = 0; // 同年 则为0岁
    } else {
      const ageDiff = nowYear - birthYear;// 年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          const dayDiff = nowDay - birthDay;// 日之差
          if (dayDiff < 0) {
            age = ageDiff - 1;
          } else {
            age = ageDiff;
          }
        } else {
          const monthDiff = nowMonth - birthMonth;// 月之差
          if (monthDiff < 0) {
            age = ageDiff - 1;
          } else {
            age = ageDiff;
          }
        }
      }
    }
    return age;// 返回周岁年龄 返回-1表示出生日期输入错误
  }
}

module.exports = app => {
  app.beforeStart(async () => {
    app.addSingleton('idcard', (config, app) => {
      return new Idcard(app);
    });
  });
};
