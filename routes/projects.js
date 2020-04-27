const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Create projects
// api/projects
router.post(
  '/',
  auth,
  [check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()],
  projectController.createProject
);

// get all project
router.get('/', auth, projectController.getProjects);

// update project by id
router.put(
  '/:id',
  auth,
  [check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()],
  projectController.updateProject
);

// delete project
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
