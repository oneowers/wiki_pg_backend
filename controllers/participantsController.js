const { Participant } = require("../models/models");

// Method to create a new participant
async function createParticipant(req, res) {
  try {
    const { state, full_name, phone_number, email, company } = req.body;
    const participant = await Participant.create({ state, full_name, phone_number, email, company });
    res.status(201).json(participant);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      let errorMessage = "A participant with this ";
      if (error.fields.phone_number) {
        errorMessage += "phone number already exists.";
      } else if (error.fields.email) {
        errorMessage += "email already exists.";
      }
      res.status(400).json({ error: errorMessage });
    } else {
      console.error("Error creating participant:", error);
      res.status(500).json({ error: "Could not create participant" });
    }
  }
}

// Method to get all participants with pagination
async function getAllParticipants(req, res) {
  try {
    // Get page and limit from query parameters, defaulting to page 1 and limit 10 if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Participant.findAndCountAll({
      offset: offset,
      limit: limit
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      items: rows
    });
  } catch (error) {
    console.error("Error getting participants:", error);
    res.status(500).json({ error: "Could not retrieve participants" });
  }
}

module.exports = { createParticipant, getAllParticipants };
