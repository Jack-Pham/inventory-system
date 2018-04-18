import { Router } from "express";
import { createUser, getUser, loginUser, getUsers, changePassword, updateInfo } from "./../services/UserService";
import { validateCreateMember, validateLoginMember,
          validateChangePassword, validateUpdateInfo } from "./../validators/UserValidator";
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

/*router.post('/', function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { name, email, roles, password, company, number } = req.body;
            const data = { name: { en: name }, email, roles, password, company, number };
            createUser(data, function (err, user) {
                if (err) {
                    if (err.message === "Email Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(user);
                }
            });
        }
    });
});*/

router.post('/createUser', verifyAuthMiddleware, function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { username, roles, company, password, name, email, number } = req.body;
            const data = { username , roles, company, password, name : {en : name}, email, number};
            createUser(data, function (err, user) {
                if (err) {
                    if (err.message === "Username Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(user);
                }
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    validateLoginMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { username, password } = req.body;
            const data = { username, password };
            loginUser(data, function (err, token, user) {
                if (err) {
                    if (err.message === "Invalid Username or Password") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(200).send({ token: token, user: user });
                }
            });
        }
    });
});

router.put('/changePassword', verifyAuthMiddleware, function (req, res, next) {
    validateChangePassword(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { currentPass, newPass } = req.body;
            const id  = req.session.userId;
            const data = { currentPass, newPass, id };
            changePassword(data, function (err, token, user) {
                if (err) {
                    if (err.message === "Invalid Password") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(200).send("Password has been changed");
                }
            });
        }
    });
});

router.put('/updateInfo', verifyAuthMiddleware, function (req, res, next) {
    validateUpdateInfo(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { newName, newNumber, newEmail } = req.body;
            const id  = req.session.userId;
            const data = { newName : {en: newName}, newNumber, newEmail, id };
            updateInfo(data, function (err, user) {
                if (err) {
                    if (err.message === "Invalid Info") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(200).send(user);
                }
            });
        }
    });
});

router.get('/', verifyAuthMiddleware, function (req, res, next) {
        getUsers(function (err, users) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(users);
            }
        });
});

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getUser(id, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(user);
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;
