const path = require("path");

const express = require("express");
const sgMail = require("@sendgrid/mail");
const bodyParser = require('body-parser');
const { body } = require("express-validator");
const { validationResult } = require("express-validator");

const app = express();

const rootPath = path.dirname(process.mainModule.filename);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootPath, "public")));

app.post('/sendmail',
    body('name').isAlpha("en-US",{ ignore: " " }),
    body('email').isEmail(),
    
    (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);

        const errors_arr = {...errors}.errors;
        let invalidEmailQuery;
        let invalidNameQuery;

        for(let i=0; i<errors_arr.length; i++){
            if(errors_arr[i].param === "name"){
                invalidNameQuery = "invalidName=1"
            }else if(errors_arr[i].param === "email"){
                invalidEmailQuery = "invalidEmail=1"
            }
        }

        let queries;
        if(invalidEmailQuery && invalidNameQuery){
            queries=invalidEmailQuery+','+invalidNameQuery;
        }else if(invalidEmailQuery) {
            queries=invalidEmailQuery
        }else if(invalidNameQuery){
            queries=invalidNameQuery
        }
        res.setHeader('Set-Cookie', `${queries},name=${req.body.name},email=${req.body.email},message=${req.body.message}`);
        return res.status(422).redirect('/#contact');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'alifais1122@gmail.com',
        from:'alifaisal1ic@gmail.com',
        subject: `A message from ${req.body.name} with the email: ${req.body.email} using the portpholio contact!`,
        text: req.body.message,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',

      };
    sgMail.send(msg).then(result => {
        console.log(result);
        if(result[0].statusCode !== 202 && result[0].statusCode !== 201 && result[0].statusCode !== 200){
            const err = new Error('Email was rejected by sendgrid');
            err.statusCode = result[0].statusCode;
            throw err;
        }
        res.redirect('/?result=success')
    }).catch(err => {
        console.log(err, err.response.body);
        if(err.code >= 500 && err.code <= 511){
            res.redirect('/?result=server-error#contact')
        }
        res.redirect('/?result=bad-request#contact')
    });
});

app.get('/resume', (req,res,next) => {
    res.sendFile(path.join(rootPath,"public","assets", 'Resume.pdf'));
});

app.listen(process.env.PORT);