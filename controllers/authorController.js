const authorModel = require("../models/authorShema");
const bcrypt = require("bcrypt");
const blogModel = require("../models/blogShema");

const authorRegister = async (req, res) => {
  const data = req.body;

  const user = new authorModel({
    username: data.username,
    email: data.email,
    password: data.password,
  });

  const isexist = await authorModel.findOne({ email: user.email });
  if (isexist) {
    res.status(409).send(`${user.email} already exist`);
  } else {
    const newUser = await authorModel.create(user);
    res.status(201).send(newUser);
  }
};

const authorLogin = async (req, res) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const user = await authorModel.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      res.status(200).send("Login Successfully...");
    } else {
      res.status(404).send("Incorrect Username or Password");
    }
  }
};

const getAccount = async (req, res) => {
  const id = req.params;
  const user = await authorModel.findOne({ authorId: id });
  res.status(200).send(user);
};

const createBlog = async (req, res) => {
  const { title, content, category, tags } = req.body;
  const newBlog = new blogModel({
    title: title,
    content: content,
    category: category,
    tags: tags,
  });

  const newBlogPost = await blogModel.create(newBlog);
  res.send(newBlogPost);
};
const blogById = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("blog not found...!");
  }
};
const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const removeblog = await blogModel.findOneAndDelete({ blogId: id });
  if (removeblog) {
    res.status(200).send("post deleted");
  } else {
    res.status(400).send("something went wrong");
  }
};
const viewComments = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    const comments = blog.comments;
    res.status(200).send(comments);
  } else {
    res.status(404).send("comments not found");
  }
};

const viewLikes = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    const likes = blog.likes;
    res.status(200).send(likes);
  } else {
    res.status(404).send("Likes not found");
  }
};
module.exports = {
  authorRegister,
  authorLogin,
  getAccount,
  createBlog,
  blogById,
  deleteBlog,
  viewLikes,
  viewComments,
};
