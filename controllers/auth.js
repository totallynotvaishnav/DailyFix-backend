const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Users = require('../models/users');

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array(),
        });
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    console.log(req.body);
    let userCheck;
    try {
        userCheck = await Users.findUserByEmail(email);
    } catch (err) {
        res.status(500).json({
            message: 'cant reach the server',
        });
    }

    if (!userCheck) {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new Users(email, hashedPassword, name);
            await newUser.save();
            const userData = await Users.findUserByEmail(newUser.email);
            const token = jwt.sign(
                {
                    email: userData.email,
                    userId: userData._id,
                },
                'sunrotateseasttowestanditwillneverchange',
                { expiresIn: '1h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                id: userData._id,
                name: userData.name,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: `cant signup the user, try again later`,
                error: err,
            });
        }
    } else {
        res.status(422).json({
            message: 'User already exists',
        });
    }
};

exports.loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await Users.findUserByEmail(email);

    if (userData) {
        try {
            const userExist = await bcrypt.compare(password, userData.password);
            if (userExist) {
                const token = jwt.sign(
                    {
                        email: userData.email,
                        userId: userData._id,
                    },
                    'sunrotateseasttowestanditwillneverchange',
                    { expiresIn: '1h' }
                );

                res.status(200).json({
                    token,
                    id: userData._id,
                    name: userData.name,
                });
            } else {
                res.status(401).json({
                    message: 'Password given is incorrect',
                });
            }
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    } else {
        res.status(404).json({
            message: 'User doesnt exist',
        });
    }
};
