const apiError = require("../utils/apierror");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documont = await Model.findByIdAndDelete(id);
    if (!documont) {
      return next(new apiError(`No document for this Id ${id}`, 404));
    }
    documont.deleteOne();
    res.status(204).send();
  });
exports.updateONe = (Model) =>
  asyncHandler(async (req, res, next) => {
    const name = req.body.name;
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new apiError(`No document for this Id ${req.params.id}`, 404)
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1) Build Query
    let query = Model.findById(id);
    if (populationOpt) query.populate(populationOpt);
    //2) Excute query
    const document = await query;
    if (!document) {
      return next(new apiError(`No Document for this Id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //Build Query
    const docuumetsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .pagination(docuumetsCount)
      .filter()
      .search(modelName)
      .sort()
      .limtiFilter();
    //Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ result: document.length, paginationResult, data: document });
  });
