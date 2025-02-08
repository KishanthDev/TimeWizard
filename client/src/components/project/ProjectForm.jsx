import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../slices/projectSlice";
import { fetchEmployees } from "../../slices/employeeSlice";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

const ProjectForm = ({ handleClose }) => {
  const { employees } = useSelector((state) => state.employees);
  const {isLoading} = useSelector((state)=>state.projects)
  const dispatch = useDispatch();

  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(fetchEmployees({ search }));
  }, [dispatch, search]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teams: [],
    budget: "",
    deadLine: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      attachments: files,
    }));
  };

  // Handle Team Selection
  const handleTeamChange = (selectedOptions) => {
    const selectedTeams = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, teams: selectedTeams }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Project Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Project Name is required!";
    } else if (formData.name.length < 5) {
      newErrors.name = "Project Name should be at least 5 characters!";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required!";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description should be at least 10 characters!";
    }

    // Budget validation
    if (!formData.budget) {
      newErrors.budget = "Budget is required!";
    } else if (formData.budget < 50) {
      newErrors.budget = "Budget should be at least 50!";
    }

    // Teams validation
    if (formData.teams.length < 3) {
      newErrors.teams = "Please assign at least 3 team members!";
    }

    // DeadLine validation (ensure it's not a past date)
    if (!formData.deadLine) {
      newErrors.deadLine = "DeadLine is required!";
    } else if (new Date(formData.deadLine) < new Date()) {
      newErrors.deadLine = "DeadLine cannot be a past date!";
    }

    if (!formData.attachments || formData.attachments.length < 2) {
      newErrors.attachments = "Upload at least 2 project document!";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "application/x-pdf"];

      const invalidFiles = formData.attachments.filter((file) => {
        return !file.type || !allowedTypes.includes(file.type);
      });

      if (invalidFiles.length > 0) {
        newErrors.attachments = "Only JPG, PNG, and PDF files are allowed!";
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validate()) return;

    const projectData = new FormData();
    projectData.append("name", formData.name);
    projectData.append("description", formData.description);
    projectData.append("budget", formData.budget);
    projectData.append("deadLine", formData.deadLine);
    formData.teams.forEach((team) => projectData.append("teams", team));
    formData.attachments.forEach((file) => projectData.append("attachments", file));

    try {
      await dispatch(createProject(projectData)).unwrap();
      console.log(projectData);
      toast.success("Project created successfully");
      setFormData({
        name: "",
        description: "",
        teams: [],
        budget: "",
        deadLine: "",
        attachments: [],
      });
      setErrors({});
      handleClose()
    } catch (error) {
      console.log(error);
      
      toast.error(error);
    }
  };

  // Prepare options for react-select
  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.username,
  }));

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
        Create Project
        <button
          onClick={handleClose}
          className="text-xl font-bold text-gray-600 hover:text-red-600 focus:outline-none"
        >
          &times; {/* This represents the cross symbol */}
        </button>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">
              Project Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className={`border p-2 rounded ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="description">
              Project Description:
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className={`border p-2 rounded ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="budget">
              Budget:
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              className={`border p-2 rounded ${errors.budget ? "border-red-500" : ""}`}
            />
            {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
          </div>

          {/* DeadLine */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="deadLine">
              DeadLine:
            </label>
            <input
              type="date"
              name="deadLine"
              id="deadLine"
              value={formData.deadLine}
              onChange={handleChange}
              className={`border p-2 rounded ${errors.deadLine ? "border-red-500" : ""}`}
            />
            {errors.deadLine && <p className="text-red-500 text-sm">{errors.deadLine}</p>}
          </div>

          {/* Teams */}
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700">Assign Teams:</label>
            <Select
              isMulti
              name="teams"
              options={employeeOptions}
              onInputChange={(inputValue) => setSearch(inputValue)} // Triggers backend search
              onChange={handleTeamChange}
              placeholder="Search and select employees..."
            />
            {errors.teams && <p className="text-red-500 text-sm">{errors.teams}</p>}
          </div>



          {/* File Upload */}
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="attachments">
              Attachments:
            </label>
            <input
              type="file"
              multiple
              name="attachments"
              id="attachments"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
            {errors.attachments && <p className="text-red-500 text-sm">{errors.attachments}</p>}
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-4">
          <button disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">
            {isLoading?"Creating":"Create"} Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;