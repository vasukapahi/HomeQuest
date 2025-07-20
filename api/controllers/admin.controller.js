import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch users!'));
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to update user status!'));
  }
};
