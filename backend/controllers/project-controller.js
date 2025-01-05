import mongoose from 'mongoose';
import Project from "../models/project-model.js";

const projectCntrl = {};

// Handle creating a project and saving uploaded files
projectCntrl.createProject = async (req, res) => {
  try {
    const files = req.files;  // Grab files from the request
    console.log('Files:', files);

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded for the project' });
    }

    const { name, description, teams, budget } = req.body;
    console.log("Controller");

    // Convert team strings to ObjectIds
    const teamIds = JSON.parse(teams).map(team => new mongoose.Types.ObjectId(team)); // Use `new` here

    // Map the files to store file paths and metadata
    const attachments = req.files.map(file => ({
      filename: file.filename,
      fileType: file.mimetype,
      filePath: file.path, // Save the file path
    }));

    // Create a new project document
    const project = new Project({
      name,
      description,
      teams: teamIds,  // Store ObjectIds
      budget,
      attachments
    });

    // Save the project to MongoDB
    await project.save();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

export default projectCntrl;
