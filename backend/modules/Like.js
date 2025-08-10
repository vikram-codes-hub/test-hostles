import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  likedAt: {
    type: Date,
    default: Date.now,
  },
});

likeSchema.index({ userId: 1, hostelId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
