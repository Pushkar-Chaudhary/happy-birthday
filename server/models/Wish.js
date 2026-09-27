import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema({
  slug:          { type: String, required: true, unique: true, index: true },
  sender:        { type: String, default: 'guest' },
  senderName:    { type: String, required: true, trim: true, maxlength: 60, default: 'Someone Special' },
  senderAvatar:  { type: String, default: '' },
  recipientName: { type: String, required: true, trim: true, maxlength: 60 },
  message:       { type: String, required: true, maxlength: 1000 },
  theme:         { type: String, enum: ['rose', 'galaxy', 'ocean', 'forest', 'gold'], default: 'rose' },
  bouquet: {
    flowers:  { type: Object, default: { rose: 3 } },
    wrapping: { type: String, default: 'kraft' },
    ribbon:   { type: String, default: 'pink' },
  },
  views: { type: Number, default: 0 },
}, { timestamps: true });

wishSchema.index({ createdAt: -1 });

export default mongoose.model('Wish', wishSchema);
