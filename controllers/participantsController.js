// participantsController.js

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


// Method to get all participants
async function getAllParticipants(req, res) {
  try {
    const participants = await Participant.findAll();
    res.status(200).json(participants);
  } catch (error) {
    console.error("Error getting participants:", error);
    res.status(500).json({ error: "Could not retrieve participants" });
  }
}

module.exports = { createParticipant, getAllParticipants };
