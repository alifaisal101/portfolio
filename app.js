const path = require("path");

const express = require("express");

const app = express();

const rootPath = path.dirname(process.mainModule.filename);

app.use(express.static(path.join(rootPath, "public")));

app.listen(process.env.PORT);