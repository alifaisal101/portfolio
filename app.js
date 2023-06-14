const https = require("https");
const path = require("path");
const fs = require("fs");

const express = require("express");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");

const PORT = process.env.PORT || 443;

const app = express();

https.createServer({key: fs.readFileSync('key.pem'), cert:fs.readFileSync('cert.pem')},app).listen(PORT, () => {console.log(`Listening on port ${PORT}...`)});

const rootPath = path.dirname(process.mainModule.filename);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootPath, "public")));

app.post(
  "/sendmail",
  body("name").isAlpha("en-US", { ignore: " " }),
  body("email").isEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).redirect("/?result=unvalid#contact");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `A message from ${req.body.name} with the email: ${req.body.email} using the portpholio contact!`,
      text: req.body.message,
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then((result) => {
        if (
          result[0].statusCode !== 202 &&
          result[0].statusCode !== 201 &&
          result[0].statusCode !== 200
        ) {
          const err = new Error("Email was rejected by sendgrid");
          err.statusCode = result[0].statusCode;
          throw err;
        }
        res.redirect("/?result=success#contact");
      })
      .catch((err) => {
        if (err.code >= 500 && err.code <= 511) {
          res.redirect("/?result=server-error#contact");
        }
        res.redirect("/?result=bad-request#contact");
      });
  }
);

app.get("/resume", (req, res, next) => {
  res.sendFile(path.join(rootPath, "public", "assets", "Resume.pdf"));
});

app.use((error, req, res, next) => {
    return res.status(500).sendFile(path.join(rootPath, "500.html"));
});
  

