const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const { adminJs, adminRouter } = require('./adminJS');
const { setSomeData } = require('./helpers/setData');

const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');
const postRouter = require('./routes/post-routes');
const categoryRouter = require('./routes/category-routes');
const commentRouter = require('./routes/comment-routes');

app.use(express.static(path.join(__dirname,'/')));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'uploads')));
app.use(cookieParser());

app.use(authRouter);
app.use(userRouter);
app.use(postRouter);
app.use(categoryRouter);
app.use(commentRouter);

app.use(adminJs.options.rootPath, adminRouter)

setSomeData();

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}/`);
    console.log(`AdminJS started on http://localhost:${process.env.PORT}${adminJs.options.rootPath}`)
});


