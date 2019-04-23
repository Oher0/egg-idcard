'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/verify/:idno', controller.home.verify);
  router.get('/info/:idno', controller.home.info);
  router.get('/rand', controller.home.rand);
};
