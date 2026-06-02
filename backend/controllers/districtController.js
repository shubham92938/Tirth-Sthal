const District = require("../models/District");
const Temple   = require("../models/Temple");

// ── सभी Districts ──
exports.getAllDistricts = async (req, res, next) => {
  try {
    const { state } = req.query;
    const query = { isActive: true };
    if (state) query.state = state;

    const districts = await District.find(query).sort("name");

    res.status(200).json({ success: true, count: districts.length, districts });
  } catch (error) {
    next(error);
  }
};

// ── Single District by slug ──
exports.getDistrictBySlug = async (req, res, next) => {
  try {
    const district = await District.findOne({ slug: req.params.slug, isActive: true });
    if (!district) {
      return res.status(404).json({ success: false, message: "District not found" });
    }

    // Us district ke temples bhi bhejo
    const temples = await Temple
      .find({ district: district.name, isActive: true })
      .select("name slug deity deityColor images rating reviews type address");

    res.status(200).json({ success: true, district, temples });
  } catch (error) {
    next(error);
  }
};

// ── District create (Admin) ──
exports.createDistrict = async (req, res, next) => {
  try {
    const district = await District.create(req.body);
    res.status(201).json({ success: true, district });
  } catch (error) {
    next(error);
  }
};

// ── District update (Admin) ──
exports.updateDistrict = async (req, res, next) => {
  try {
    const district = await District.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!district) {
      return res.status(404).json({ success: false, message: "District not found" });
    }
    res.status(200).json({ success: true, district });
  } catch (error) {
    next(error);
  }
};

// ── District delete (Admin) ──
exports.deleteDistrict = async (req, res, next) => {
  try {
    await District.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: "District deleted" });
  } catch (error) {
    next(error);
  }
};

// ── Temple count sync (Admin utility) ──
exports.syncTempleCount = async (req, res, next) => {
  try {
    const districts = await District.find({ isActive: true });

    for (const district of districts) {
      const count = await Temple.countDocuments({
        district: district.name,
        isActive: true,
      });
      district.templeCount = count;
      await district.save();
    }

    res.status(200).json({ success: true, message: "Temple counts synced" });
  } catch (error) {
    next(error);
  }
};