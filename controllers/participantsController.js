// participantsController.js

const Participant = require("../models/participant");

// Метод для создания нового участника
async function createParticipant(req, res) {
  try {
    const { state, full_name, phone_number } = req.body;
    const participant = await Participant.create({ state, full_name, phone_number });
    res.status(201).json(participant);
  } catch (error) {
    console.error("Error creating participant:", error);
    res.status(500).json({ error: "Could not create participant" });
  }
}

// Метод для получения списка всех участников
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
