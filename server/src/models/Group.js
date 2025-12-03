import mongoose from 'mongoose';
import slugify from 'slugify';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    slug: { type: String, unique: true },

    description: { type: String },

    visibility: {
      type: String,
      enum: ['PUBLIC'],
      default: 'PUBLIC',
    },

    memberCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate slug when creating a group
groupSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
});

export default mongoose.model('Group', groupSchema);
