const router = require("express").Router();

router.get("/create", async (req, res) => {
  res.render("createAccessory", { title: "Create New Accessory" });
});

router.post("/create", async (req, res) => {
  const accessory = {
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  };

  try {
    await req.storage.createAccessory(accessory);
  } catch (error) {
    console.log(error.massage);
  }

  res.redirect("/");
});

module.exports = router;
