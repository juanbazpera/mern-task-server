const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
  // has error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // extract project and check if it exist
  try {
    const { project } = req.body;
    // check id
    if (!project.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // check if project belongs to user
    if (existProject.userCreator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    // create task
    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};

// get task by project
exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    // check id
    if (!project.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    const tasks = await Task.find({ project }).sort({ date: -1 });
    res.json({ tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};

// update task by id
exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;
    // check id
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    // check if task exist
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    const existProject = await Project.findById(project);
    // exist project
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // check userCreator
    if (existProject.userCreator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // create obj with new info
    const newTask = {};
    newTask.name = name;
    newTask.state = state;

    // update task
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });
    res.json({ task });
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};

// delete task by id
exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;
    // check id
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    // check if task exist
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    const existProject = await Project.findById(project);
    // exist project
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // check userCreator
    if (existProject.userCreator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // delete
    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea eliminada' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};
