var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "khactrungcc18@gmail.com", //Email gửi đi
        pass: "xfbc oiet tclr zgvu" // Mật khẩu email gửi
    }
});
module.exports = transporter;