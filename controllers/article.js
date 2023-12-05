const Article = require("../models/Article");

exports.create = async (req, res) => {
    const {title, subtitle, image, video_url, description} = req.body;

    await Article.create({
        title,
        subtitle,
        image,
        video_url,
        description
    });
    return res.json({status: 'Article Created', success: true});
}

exports.retrieve = async (req, res) => {
    const {limit, page, date_to, date_from, id} = req.query;

    const query = Article.find();

    if (date_from)
        query.where("createdAt").gte(new Date(date_from));

    if (date_to)
        query.where("createdAt").lte(new Date(date_to));

    if (id)
        query.where({_id: id});

    const articles = await query;

    return res.json({
        total: articles.length,
        articles: pagination(articles, limit, page)
    });
}

exports.update = async (req, res) => {
    const {id, title, subtitle, image, video_url, description} = req.body;

    await Article.updateOne({
        id,
        title,
        subtitle,
        image,
        video_url,
        description
    });
    return res.json({status: 'Article Updated', success: true});
}

exports.delete = async (req, res) => {
    const {id} = req.query;

    await Article.findOneAndDelete({id});
    return res.json({status: 'Article Deleted', success: true});
}

const pagination = (data, limit, page) => {
    if (limit && !page) {
        return data.slice(0, limit);
    } else if (!limit && page) {
        const offset = 10 * (page - 1);
        return data.slice(offset, offset + 10);
    } else if (limit && page) {
        const offset = limit * (page - 1);
        return data.slice(offset, offset + Number(limit));
    } else {
        return data;
    }
};