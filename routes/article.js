const {Router} = require("express");
const Article = require("../controllers/article");

const router = Router();

router.post("/create", Article.create);
router.get("/retrieve", Article.retrieve);
router.post("/update", Article.update);
router.post("/delete", Article.delete);

exports.articlesRouter = router;
