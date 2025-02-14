import Project from "../models/project-model.js";
const projectCntrl = {};
import cloudinary from '../config/cloudinary.js';
import User from "../models/user-model.js";

projectCntrl.createProject = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded for the project" });
    }

    const admin = await User.findById(req.currentUser.id)

    const { plan } = admin.subscription;
    let maxProjects = 0;

    if (plan === "free") maxProjects = 5;  // Limit for free plan
    else if (plan === "basic") maxProjects = 20; // Limit for basic plan
    else if (plan === "premium") maxProjects = Infinity; // Unlimited for premium

    if (admin.projectsCreated >= maxProjects) {
      return res.status(403).json({ message: `Project limit reached for ${plan} plan` });
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

    const { name, description, teams, budget,deadLine } = req.body;
    
    const teamIds = teams.map(team =>team);

    const project = new Project({
      name,
      description,
      teams: teamIds,  
      budget,
      attachments: projectDocuments,
      deadLine
    });

    await project.save();
    
    await User.findByIdAndUpdate(req.currentUser.id, { $inc: { projectsCreated: 1 } });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

projectCntrl.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, teams, budget, deadLine } = req.body;
    const files = req.files;

       // Find existing project
    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prepare update object (only update provided fields)
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (teams) updateData.teams = teams.map(team => team);
    if (budget) updateData.budget = budget;
    if (deadLine) updateData.deadLine = deadLine;

    // Handle new file uploads
    if (files && files.length > 0) {
      // Delete old attachments from Cloudinary
      for (let doc of project.attachments) {
        await cloudinary.uploader.destroy(doc.publicId);
      }

      // Upload new attachments
      const projectDocuments = [];
      for (let file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "project_documents",
          resource_type: "auto",
        });

        projectDocuments.push({
          filePath: result.secure_url,
          publicId: result.public_id,
        });
      }

      // Add attachments to update object
      updateData.attachments = projectDocuments;
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true}
    );

    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project", error: error.message });
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

projectCntrl.remove = async (req, res) => {
  const id = req.params.id;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

projectCntrl.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const project = await Project.findById(id).populate("teams","username")
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export default projectCntrl;
