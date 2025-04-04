import { Schema,model } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  teams: [{ type:Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    publicId: { type: String },
    filePath: {type:String}
  }],
  budget:Number,
  deadLine:Date,
  status: { type: String, enum: ['pending', 'ongoing',"overdue", 'completed'], default: 'pending' },
},{timestamps:true});

const Project = model('Project', ProjectSchema)

export default Project
