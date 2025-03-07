import ActivityLog from "../models/activity-model.js";

const activityLog = {};
activityLog.get = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId, search, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;

        const query = {};
        if (userId) query.userId = userId; // Filter by Employee
        if (search) query.action = { $regex: search, $options: 'i' }; 

        const activities = await ActivityLog.find(query)
            .populate('userId', 'username')
            .populate('projectId', 'name')
            .populate('taskId', 'name')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ActivityLog.countDocuments(query);

        const uniqueEmp = await ActivityLog.find({})
            .populate('userId', 'username')
        const uniqueEmployees = uniqueEmp.reduce((acc, activity) => {
            if (!acc.some(emp => emp.userId === activity.userId)) {
                acc.push({ userId: activity.userId, name: activity.user });
            }
            return acc;
        }, []);

        res.status(200).json({
            activities: activities.map(activity => ({
                _id: activity._id,
                user: activity.userId?.username || "Unknown",
                userId: activity.userId?._id,
                project: activity.projectId?.name || "No Project",
                task: activity.taskId?.name || "No Task",
                action: activity.action,
                timestamp: activity.timestamp
            })),
            uniqueEmployees, // Include all employees with activities
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
};


activityLog.getAll = async (req, res) => {
    try {
        const activities = await ActivityLog.find()
        res.status(200).json({
            activities: activities.map(activity => ({
                _id: activity._id,
                user: activity.userId?.username || "Unknown",
                userId: activity.userId._id,
                project: activity.projectId?.name || "No Project",
                task: activity.taskId?.name || "No Task",
                action: activity.action,
                timestamp: activity.timestamp
            }))
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
}

export default activityLog;
