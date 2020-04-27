const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// create a task
// api/task
router.post(
  '/',
  auth,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('project', 'El proyecto es obligatorio').not().isEmpty(),
  ],
  taskController.createTask
);

// get task by project
router.get('/', auth, taskController.getTasks);

// update task by id and project
router.put('/:id', auth, taskController.updateTask);

// delete task by id and project
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
