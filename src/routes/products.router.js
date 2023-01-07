import express from "express";


const router = express.Router();

router.get("/", (req, res) => {
  const users = utils.users;
  const role = true;
  const myUser = {
    title: "Este es el titulo",
    users: users,
    role: role,
    style: "style.css",
  };
  console.log("desde el servidor");
  res.render("form", myUser);
});

export default router;