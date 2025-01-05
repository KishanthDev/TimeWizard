import mongoose from 'mongoose';
import Project from "../models/project-model.js";

const projectCntrl = {};

projectCntrl.createProject = async (req, res) => {
  try {
    if(req.currentUser.role!=="admin"){
      return res.status(403).json({error:"Only admin can assign project"})
    }
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded for the project' });
    }

    const { name, description, teams, budget } = req.body;
    // Convert team strings to ObjectIds
    const teamIds = JSON.parse(teams).map(team => new mongoose.Types.ObjectId(team));

    const attachments = req.files.map(file => ({
      filename: file.filename,
      fileType: file.mimetype,
      filePath: file.path, 
    }));

    const project = new Project({
      name,
      description,
      teams: teamIds,  
      budget,
      attachments
    });

    await project.save();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

export default projectCntrl;
