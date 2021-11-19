const { Router } = require("express");
const { isAuth, isOwner } = require("../middlewares/guards");
const { preloadCube } = require("../middlewares/preload");

const router = Router();

router.get("/", async (req, res) => {
  const cubes = await req.storage.getAll(req.query);

  if (req.query.search == "/") req.query.search = undefined;

  const ctx = {
    title: "Cataloge",
    cubes,
    search: req.query.search || "",
    from: req.query.from || "",
    to: req.query.to || "",
  };

  res.render("index", ctx);
});

router.get("/create", isAuth(), (req, res) => {
  res.render("create", { title: "Create Cube" });
});

router.post("/create", isAuth(), async (req, res) => {
  const cube = {
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    difficulty: Number(req.body.difficulty),
    author: req.user._id,
  };

  try {
    await req.storage.create(cube);
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.render("create", {
        title: "Create Cube",
        error: "All fields are required.",
      });
    }
  }
  res.redirect("/");
});

router.get("/details/:id", preloadCube(), async (req, res) => {
  const cube = req.data.cube;

  if (cube == undefined) {
    res.redirect("/404");
  } else {
    cube.isOwner = req.user && cube.authorId == req.user._id;
    const ctx = {
      title: "Details",
      cube,
    };
    res.render("details", ctx);
  }
});

router.get("/edit/:id", preloadCube(), isOwner(), async (req, res) => {
  const cube = req.data.cube;

  if (!cube) {
    res.redirect("/404");
  } else {
    cube[`select${cube.difficulty}`] = true;

    const ctx = {
      title: "Edit Cube",
      cube,
    };

    res.render("edit", ctx);
  }
});

router.post("/edit/:id", preloadCube(), isOwner(), async (req, res) => {
  const cube = {
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    difficulty: Number(req.body.difficulty),
  };

  try {
    await req.storage.edit(req.params.id, cube);
    res.redirect("/");
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/attach/:cubeId", async (req, res) => {
  const cube = await req.storage.getById(req.params.cubeId);
  const accessories = await req.storage.getAllAccessories(
    cube.accessories.map((a) => a._id)
  );
  res.render("attach", {
    title: "Attach Stickers",
    cube,
    accessories,
  });
});

router.post("/attach/:cubeId", async (req, res) => {
  const cubeId = req.params.cubeId;
  const stickerId = req.body.accessory;

  try {
    await req.storage.attachSticker(cubeId, stickerId);
  } catch (error) {
    console.log(error);
  }

  res.redirect(`/products/details/${cubeId}`);
});

module.exports = router;
