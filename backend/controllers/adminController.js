import pool from '../config/db.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;
    const currentAdminId = req.user.id;

    if (!role || (role !== 'user' && role !== 'admin')) {
      res.status(400);
      throw new Error("Invalid role. Role must be 'user' or 'admin'.");
    }

    // Check if target is self
    if (targetUserId === currentAdminId) {
      res.status(400);
      throw new Error('You cannot modify your own administrator role.');
    }

    // Check if target exists
    const checkUser = await pool.query('SELECT role FROM users WHERE id = $1', [targetUserId]);
    if (checkUser.rows.length === 0) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update role
    const result = await pool.query(
      `UPDATE users 
       SET role = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, email, role, created_at, updated_at`,
      [role, targetUserId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentAdminId = req.user.id;

    // Check if target is self
    if (targetUserId === currentAdminId) {
      res.status(400);
      throw new Error('You cannot delete your own administrator account.');
    }

    // Check if target exists
    const checkUser = await pool.query('SELECT role FROM users WHERE id = $1', [targetUserId]);
    if (checkUser.rows.length === 0) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [targetUserId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
