'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.idcard.name;
  }

  async verify() {
    const { app, ctx } = this;
    const { idno } = ctx.params;
    const succ = app.idcard.verify(idno);
    ctx.body = JSON.stringify(succ);
  }

  async info() {
    const { app, ctx } = this;
    const { idno } = ctx.params;
    const succ = app.idcard.info(idno);
    ctx.body = JSON.stringify(succ);
  }

  async rand() {
    const { app, ctx } = this;
    const succ = app.idcard.random();
    ctx.body = succ;
  }
}

module.exports = HomeController;
