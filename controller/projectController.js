const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
  // check validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new project
    console.log('Creando proyecto');
    const project = new Project(req.body);

    // save userCreator
    project.userCreator = req.user.id;
    project.save();
    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};

// get all projecto from user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userCreator: req.user.id }).sort({
      date: -1,
    });
    res.json({ projects });
  } catch (err) {
    console.log(err);
    res.status(500).send('Hubo un error');
  }
};

// update project
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // extract project info
  const { name } = req.body;
  const newProject = {};
  if (name) {
    newProject.name = name;
  }

  try {
    // check id
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    let project = await Project.findById(req.params.id);

    // exist project
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // check userCreator
    if (project.userCreator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    //update
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );
    res.json({ project });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor');
  }
};

// delete project by id
exports.deleteProject = async (req, res) => {
  try {
    // check id
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    let project = await Project.findById(req.params.id);

    // exist project
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // check userCreator
    if (project.userCreator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    //delete
    project = await Project.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Proyecto eliminado' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor');
  }
};
