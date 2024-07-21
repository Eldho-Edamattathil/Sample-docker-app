const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashpassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username: username,
            password: hashpassword
        }); // Create a new user based on request body
        req.session.user=newUser
        res.status(200).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "fail",
            message: error.message // Include error message for debugging
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            console.log("yeaah")
            req.session.user=user
            res.status(200).json({
                status: "success",
                message: "Login successful"
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: "Incorrect username or password"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "fail",
            message: error.message // Include error message for debugging
        });
    }
};
