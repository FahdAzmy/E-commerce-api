const CoponModel = require("../models/coponModel");
const factory = require("./handlerFactory");

exports.getAllCopons = factory.getAll(CoponModel);
// @desc Get sapacif Copon
// @route Post /api/v1/Copons
// @acces puplic
exports.getCopon = factory.getOne(CoponModel);

// @desc Create Copon
// @route Post /api/v1/Copons
// @acces private
exports.createCopon = factory.createOne(CoponModel);

// @desc Update category
// @route Post /api/v1/Copons
// @acces private
exports.updateCopon = factory.updateONe(CoponModel);

// @desc Delete category
// @route Post /api/v1/Copons
// @acces private
exports.deleteCopon = factory.deleteOne(CoponModel);
