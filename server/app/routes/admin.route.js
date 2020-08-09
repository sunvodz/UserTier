const auth = require("../controllers/auth/auth.admin.controller");
const controller = require("../controllers/admin.controller");
const ream = require("../controllers/ream.controller");

module.exports = function (app) {

    // TODO : Admin Authentication
    app.post("/admin/login", auth.LoginAdmin);
    app.post("/admin/register", auth.Register);

    // TODO : Admin ForgotPassword
    app.post("/admin/forgotPassword", auth.ForgotPassword);
    app.get("/admin/resetPassword/:resetPasswordToken", auth.ResetPassword);
    app.post("/admin/updatePassword", auth.UpdatePassword);
    // app.post("/admin/updatePasswordViaEmail", auth.UpdatePasswordViaEmail);

    // TODO : Admin Update
    app.put("/admin/updateAdmin", controller.UpdateAdmin);

    // TODO : Admin Get
    app.get("/admin/find", controller.FindAdmin);
    
    app.post("/admin/addream", ream.CreateReam);

};
