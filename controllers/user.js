const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const nodemailer = require("nodemailer");
const sendMail = require('./sendmail').sendMail;
const sendmailSendGrid = require('./sendmailSendGrid').sendMail;
const uploadFile = require('./fileUpload').uploadFile;
const generator = require('generate-password');
const { uid } = require('uid');

exports.signup = (req, res, next) => {

    console.log("request ", req.body)

    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.email
    }


    User.register(new User(newUser),
        req.body.password, (err, user) => {

            if (err) {
                console.log(err);
                return res.status(406).send(err);
            }

            passport.authenticate('local')(req, res, () => {

                let token = authenticate.getToken({ _id: user._id });

                const from = '"Fundamental Secret 👻" <nansen@fundamentalsecretsteam.com>',
                    to = req.user.email,
                    subject = "Verify Account",
                    body = `Click on the link below to verify your account, if it does not open in your browser, copy and paste it into your address bar.
                http://localhost:3300/user/account_verification?token=${token}`,
                    successMsg = "Sign up successful! A link to verify your account has been sent to your email!",
                    errorMsg = "Something went wrong, please try again!";

                sendMail(from, to, subject, body, successMsg, errorMsg, function (message) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.send({
                        message: message
                    });
                })

            });
        });
};


exports.verifyAccount = (req, res) => {

    User.findById({ _id: req.user._id }, function (err, user) {
        if (err) return res.send(err)

        if (user.is_verified === true) {
            return res.send({ message: `${user.firstname}! Your account has already been verified.` })
        }

        user.updateOne({ is_verified: true }, function () {
            return res.status(200).send({
                message: `Congratulations ${req.user.firstname}! Your account has been verified.`
            });
        })
    })
}

exports.setAffiliateDetails = async (req, res) => {
    const { videoTitle, videoDescription } = req.body
    const { success, error, url, keyName } = await uploadFile(req.files.file)

    if (success) {
        User.findById({ _id: req.user._id }, function (err, user) {
            if (err) return res.send(err)

            user.updateOne({ videoTitle, videoDescription, videoUrl: url, videoKeyName: keyName }, function () {
                return res.status(200).send({
                    success: true,
                    message: `Successfully added!`
                });
            })
        })
    }
    if (error) {
        return res.status(500).send({
            success: false,
            message: `Upload failed!`,
        });
    }

}

exports.loginCustomUser = (req, res, next) => {
    console.log('this req', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(401).json(err);
        }

        if (!user) {
            console.log('info ', info)
            return res.status(401).json(info);
        }
        req.logIn(user, (error) => {
            if (error) {
                console.log(error)
                return res.status(401).send(error);
            }
            // user has been loaded into the request by passport.authenticate
            var token = authenticate.getToken({ _id: req.user._id, role: user.role });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                token: token,
                firstname: user.firstname,
                uniqueurl: user.uniqueurl,
                message: `Login successful! Token: ${token}`
            });
        });
    })(req, res, next);
};

exports.inviteAffiliateUser = (req, res, next) => {
    //    return  res.status(200).json({
    //        success: true
    //    });
    console.log("request ", req.body)

    const newUser = {
        email: req.body.email,
        username: req.body.email,
        role: "affiliate",
        uniqueurl: `${req.body.email.split("@")[0]}-${uid(6)}`
    }

    const password = generator.generate({
        length: 10,
        numbers: true
    })

    User.register(new User(newUser),
        password, (err, user) => {

            if (err) {
                console.log(err);
                return res.send(err);
            }

            // passport.authenticate('local')(req, res, () => {

            //     let token = authenticate.getToken({ _id: user._id });

            const from = process.env.SENGRID_SENDER_EMAIL,
                to = req.body.email,
                subject = "Activate Account",
                body = `Click on the link below to activate your account, if it does not open in your browser, copy and paste it into your address bar. 
                Your username is ${req.body.email} and temporary password is ${password}
                http://localhost:3000/user/activate_account?email=${req.body.email}&&password=${password}`,
                successMsg = "Invite successful! A link to the account has been sent to the email!",
                errorMsg = "Something went wrong, please try again!";

                sendmailSendGrid(from, to, subject, body, successMsg, errorMsg, function (data) {
                res.setHeader('Content-Type', 'application/json');
                return res.send(data);
            })
        });
};

exports.resetPassword = (req, res) => {

    User.findById({ _id: req.user._id }, function (err, user) {

        console.log("resetPassword: ", err)
        if (err) return res.send({ message: "Something went wrong, please try again!" })

        user.setPassword(req.body.password, function (err, user) {
            console.log(err)
            if (err) return res.send(err);
            user.save();
            return res.status(200).send({ message: 'Password reset successful!' });
        });
    })

}


exports.forgotPassword = (req, res) => {
    console.log('email req', req.body);
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log(err)
            return res.send(err);
        }

        if (!user) {
            return res.send({ message: 'Incorrect email.' });
        }

        console.log("user ", user)

        let token = authenticate.getToken({ _id: user._id });

        const from = '"Fundamental Secret 👻" <nansen@fundamentalsecretsteam.com>',
            to = req.body.email,
            subject = "Update Password",
            body = `Click on the link below to change your password, if it does not open in your browser, copy and paste it into your browser.
    http://localhost:3300/user/reset_password?token=${token}`,
            successMsg = "A link to change your password has been sent to your email!",
            errorMsg = "Something went wrong, please try again!";

        sendMail(from, to, subject, body, successMsg, errorMsg, function (message) {
            return res.send({ message: message });
        })

    })
};



exports.getUsers = (req, res, next) => {
    User.find().then(
        (users) => {
            res.status(200).json(users);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.update = async (req, res, next) => {
    const { _id, firstname, lastname, email, is_affiliate, paymentMethod, cardNumber } = req.body;

    try {
        let updatedUser = await User.findOneAndUpdate(
            { _id },
            {
                firstname,
                lastname,
                email,
                is_affiliate,
                paymentMethod,
                cardNumber
            }, { new: true });
        return res.json({ status: 'User Updated', success: true, user: updatedUser });
    }
    catch (err) {
        return res.status(500).json({ status: "Failed to update suer" })
    }
}

exports.setAffiliate = async (req, res) => {
    const { id } = req.body;

    const user = await User.findById(id);

    user.admin = false;
    user.is_affiliate = true;

    await user.save();

    return res.json({ message: 'User Updated', success: true });
}

exports.delete = async (req, res, next) => {
    const { id } = req.params;

    await User.findOneAndDelete({ id });
    return res.json({ status: 'User Deleted', success: true });
}


exports.checkJWTtoken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log('error ', err);
            return next(err);
        }
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            console.log('info ', info);
            return res.json({ status: 'JWT invalid!', success: false, err: info });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT valid!', success: true, user: user.firstname });
        }
    })(req, res, next);
};


exports.createUser = (req, res, next) => {

    console.log("request ", req.body)

    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.email,
        role: req.body.role,
        is_admin: (req.body.role === 'admin' ? true : false),
    }



    User.register(new User(newUser),
        req.body.password, (err, user) => {

            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send({
                message: 'User created suuccessfully'
            });

        });
};


exports.loginAdminUser = (req, res, next) => {
    console.log('this req', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            console.log('info ', info)
            return res.send(info);
        }
        req.logIn(user, (error) => {
            if (error) {
                console.log(error)
                return res.send(error);
            }
            // user has been loaded into the request by passport.authenticate
            var token = authenticate.getToken({ _id: req.user._id, is_admin: true });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                token: token,
                firstname: user.firstname,
                message: `Login successful! Token: ${token}`
            });
        });
    })(req, res, next);
};


exports.getUserList = (req, res, next) => {
    User.find({ is_delete: false }
    ).then(
        (users) => {
            res.status(200).json(users);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getUserById = (req, res, next) => {
    User.find({ _id: req.params.id }
    ).then(
        (users) => {
            res.status(200).json(users);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.deleteUser = async (req, res, next) => {
    const {id} = req.query;
    await User.updateOne({ _id: id },{ is_delete: true });
    return res.json({ status: 'User Updated', success: true });
}

exports.userUpdate = async (req, res, next) => {
    const { id, firstname, lastname, email, is_affiliate } = req.body;

    await User.updateOne({
        _id: id},{
        firstname,
        lastname,
        email,
        is_affiliate
    });
    return res.json({ status: 'User Updated', success: true });
}

exports.fetchProfile = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            return res.send(user)
        })
        .catch(err => {
            return res.status(500).json({ success: false, status: "Failed to fetch user" })
        })
}