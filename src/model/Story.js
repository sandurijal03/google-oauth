import { Schema, model } from 'mongoose';

const {
  Types: { ObjectId },
} = Schema;

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'public',
      enum: ['public', 'private'],
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default model('Story', StorySchema);
