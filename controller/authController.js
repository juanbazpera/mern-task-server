const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.userAuth = async (req, res) => {
  // get email password
  const { email, password } = req.body.user;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Email incorrecto');
      return res.status(400).json({ msg: 'Email o Password incorrecto' });
    }

    const correctPass = await bcryptjs.compare(password, user.password);
    if (!correctPass) {
      console.log('Password incorrecto');
      return res.status(400).json({ msg: 'Email o Password incorrecto' });
    }

    // create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // signature JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// get user auth
exports.getUserAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};
