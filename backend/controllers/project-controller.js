import mongoose from 'mongoose';
import Project from "../models/project-model.js";
const projectCntrl = {};
import cloudinary from '../config/cloudinary.js';

projectCntrl.createProject = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded for the project" });
    }

    const projectDocuments = [];
    for (let file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "project_documents",
        resource_type: "auto", 
      });

      projectDocuments.push({
        filePath: result.secure_url, // Cloudinary URL
        publicId: result.public_id, // Optional for future deletion/updating
      });
    }

    const { name, description, teams, budget } = req.body;
    
    const teamIds = teams.map(team =>team);

    const project = new Project({
      name,
      description,
      teams: teamIds,  
      budget,
      attachments: projectDocuments,
    });


    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

projectCntrl.get = async (req,res) => {
  try {
    const project = await Project.find({}).populate("teams","name email profileImage")
    return res.status(200).json({project})
  } catch (err) {
    return res.status(500).json({message:"Error while getting all project",error:err.message})
  }
}

export default projectCntrl;
