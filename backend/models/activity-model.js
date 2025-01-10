import { Schema,model } from 'mongoose';

const activityLogSchema = new Schema({
  userId: { type: String, ref: 'User', required: true },
  action: { type: String, required: true },
  projectId: { type: String, ref: 'Project', default: null },
  taskId: { type: String, ref: 'Task', default: null },
  details: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = model('ActivityLog', activityLogSchema)

export default ActivityLog
