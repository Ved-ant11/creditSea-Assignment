const Report = require("../models/Report");
const { parseExperianXml } = require("../services/experianParser");

const createReport = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("XML file is required");
      error.status = 400;
      throw error;
    }

    const xmlPayload = req.file.buffer.toString("utf8");
    const parsedPayload = await parseExperianXml(xmlPayload);

    const report = await Report.create({
      ...parsedPayload,
      raw: xmlPayload,
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Report.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Report.countDocuments(),
    ]);

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).lean();
    if (!report) {
      const error = new Error("Report not found");
      error.status = 404;
      throw error;
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
};
