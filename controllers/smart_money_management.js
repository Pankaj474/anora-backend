const SmartMoneyManagement = require('../models/smart_money_management');

exports.create = (req, res, next) => {
  const newSmartMoneyManagement = {
    public_address: req.body.public_address,
    name: req.body.name,
  };

  SmartMoneyManagement.create(
    newSmartMoneyManagement,
    (err, smartMoneyManagement) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.send({
        message: 'Smart Money Management created suuccessfully',
      });
    }
  );
};

exports.getAll = (req, res, next) => {
  SmartMoneyManagement.find({ is_deleted: false })
    .then((smartMoneyManagements) => {
      res.status(200).json(smartMoneyManagements);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.get = (req, res, next) => {
  SmartMoneyManagement.find({ _id: req.params.id })
    .then((smartMoneyManagements) => {
      res.status(200).json(smartMoneyManagements);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getNameByAddress = (req, res, next) => {
  SmartMoneyManagement.find({ public_address: req.params.address })
    .then((smartMoneyManagements) => {
      res.status(200).json(smartMoneyManagements);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  await SmartMoneyManagement.updateOne({ _id: id }, { is_deleted: true });
  return res.json({ status: 'Smart Money Management Updated', success: true });
};

exports.update = async (req, res, next) => {
  const { id, public_address, name } = req.body;

  await SmartMoneyManagement.updateOne({ _id: id }, { public_address, name });
  return res.json({ status: 'Smart Money Management Updated', success: true });
};
