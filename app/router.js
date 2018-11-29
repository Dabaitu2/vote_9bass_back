'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getPut', controller.getPut.index);
  router.put('/getPut', controller.getPut.answer);
  router.resources('users', '/users', controller.user);
  router.resources('votes', '/votes', controller.vote);
  router.get('/count', controller.user.count);
  router.post('/addVote', controller.vote.addVote);
  router.post('/addVoter', controller.vote.addVoter);
  router.post('/uploadVote', controller.upload.uploadVote);
  router.post('/login', controller.user.login);
  router.post('/MyProjects', controller.user.MyProjects);
  router.post('/getHistory', controller.user.getHistory);
  router.post('/download', controller.user.download);
};
