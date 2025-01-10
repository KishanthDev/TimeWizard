import ActivityLog from "../models/activity-model.js";

const activityLog = {}

activityLog.get = async (req,res) => {
    try {
        const activities = await ActivityLog.find({})
          .populate('userId', 'name') 
          .populate('projectId', 'name')
          .populate('taskId', 'name');
    
        res.status(200).send(activities);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch activities' });
      }
}

export default activityLog