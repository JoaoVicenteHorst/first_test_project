import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/users';
import '../App.css';

function UserManagement() {
  const { user, logout, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for creating new user
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    setIsModalOpen(true);
  };

  // Open modal for editing existing user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't show existing password
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    const targetUser = users.find(u => u.id === id);
    const isOwnAccount = id === user.id;
    
    const confirmMessage = isOwnAccount
      ? 'Are you sure you want to delete your own account? You will be logged out.'
      : `Are you sure you want to delete ${targetUser?.name || 'this user'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(user => user.id !== id));
        
        // If user deleted their own account, log them out
        if (isOwnAccount) {
          alert('Your account has been deleted. You will be logged out.');
          logout();
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
        console.error('Error deleting user:', err);
      }
    }
  };

  // Save user (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user (password is optional on update)
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }
        const updatedUser = await userAPI.update(editingUser.id, updateData);
        setUsers(users.map(user => 
          user.id === editingUser.id ? updatedUser : user
        ));
      } else {
        // Create new user (password is required)
        if (!formData.password) {
          alert('Password is required for new users');
          return;
        }
        const newUser = await userAPI.create(formData);
        setUsers([...users, newUser]);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Error saving user:', err);
    }
  };

  // Cancel and close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    setEditingUser(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Check if current user can edit a specific user
  const canEditUser = (targetUser) => {
    if (user.role === 'Admin') {
      return true; // Admin can edit anyone
    } else if (user.role === 'Manager') {
      // Manager can edit themselves or User role accounts
      return targetUser.id === user.id || targetUser.role === 'User';
    } else {
      // Users can only edit themselves
      return targetUser.id === user.id;
    }
  };

  // Check if current user has limited edit permissions (email/password only)
  const hasLimitedEditPermissions = () => {
    return user.role === 'User';
  };

  // Group users by role
  const adminUsers = users.filter(u => u.role === 'Admin');
  const managerUsers = users.filter(u => u.role === 'Manager');
  const regularUsers = users.filter(u => u.role === 'User');

  // Render a user card
  const renderUserCard = (userItem) => (
    <div key={userItem.id} className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {userItem.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-card-info">
          <h3>{userItem.name}</h3>
          <p className="user-email">{userItem.email}</p>
        </div>
      </div>
      <div className="user-card-body">
        <div className="user-card-field">
          <span className="field-label">ID:</span>
          <span className="field-value">{userItem.id}</span>
        </div>
        <div className="user-card-field">
          <span className="field-label">Status:</span>
          <span className={`badge badge-${userItem.status.toLowerCase()}`}>
            {userItem.status}
          </span>
        </div>
      </div>
      <div className="user-card-actions">
        {/* Edit button - based on role permissions */}
        {canEditUser(userItem) ? (
          <button 
            className="btn btn-secondary btn-small" 
            onClick={() => handleEdit(userItem)}
            title={
              userItem.id === user.id 
                ? user.role === 'User' 
                  ? 'Edit email and password' 
                  : 'Edit my account'
                : 'Edit user'
            }
          >
            ✏️ Edit
          </button>
        ) : (
          <button 
            className="btn btn-secondary btn-small" 
            disabled
            title={
              user.role === 'Manager'
                ? 'Managers can only edit User role accounts'
                : 'You can only edit your own account'
            }
          >
            ✏️ Edit
          </button>
        )}
        
        {/* Delete button - Admins can delete others (not themselves), non-admins can only delete themselves */}
        {(user.role === 'Admin' && userItem.id !== user.id) || 
         (user.role !== 'Admin' && userItem.id === user.id) ? (
          <button 
            className="btn btn-danger btn-small" 
            onClick={() => handleDelete(userItem.id)}
            title={user.role === 'Admin' ? 'Delete user' : 'Delete my account'}
          >
            🗑️ Delete
          </button>
        ) : (
          <button 
            className="btn btn-danger btn-small" 
            disabled
            title={
              user.role === 'Admin' 
                ? 'You cannot delete your own account' 
                : 'Only admins can delete other users'
            }
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <h1>👥 User Management</h1>
            <p>Manage your users efficiently</p>
          </div>
          <div className="user-info">
            <span className={`badge badge-${user.role.toLowerCase()}`}>
              {user.role}
            </span>
            <span className="user-name">{user.name}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="error-message">
            <p>⚠️ Error: {error}</p>
            <button onClick={fetchUsers} className="btn btn-secondary">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="toolbar">
              {isAdmin() ? (
                <button className="btn btn-primary" onClick={handleCreate}>
                  ➕ Add New User
                </button>
              ) : (
                <div className="info-banner">
                  <span>👁️ Viewing users - Only administrators can create new accounts</span>
                </div>
              )}
              <div className="stats">
                <span className="stat">Total: {users.length}</span>
                <span className="stat">Active: {users.filter(u => u.status === 'Active').length}</span>
              </div>
            </div>

            <div className="cards-container">
              {/* Admin Section */}
              {adminUsers.length > 0 && (
                <div className="role-section">
                  <div className="role-section-header">
                    <h2>
                      <span className="badge badge-admin">Admin</span>
                      Administrators
                    </h2>
                    <span className="role-count">{adminUsers.length} {adminUsers.length === 1 ? 'user' : 'users'}</span>
                  </div>
                  <div className="user-cards-grid">
                    {adminUsers.map(renderUserCard)}
                  </div>
                </div>
              )}

              {/* Manager Section */}
              {managerUsers.length > 0 && (
                <div className="role-section">
                  <div className="role-section-header">
                    <h2>
                      <span className="badge badge-manager">Manager</span>
                      Managers
                    </h2>
                    <span className="role-count">{managerUsers.length} {managerUsers.length === 1 ? 'user' : 'users'}</span>
                  </div>
                  <div className="user-cards-grid">
                    {managerUsers.map(renderUserCard)}
                  </div>
                </div>
              )}

              {/* User Section */}
              {regularUsers.length > 0 && (
                <div className="role-section">
                  <div className="role-section-header">
                    <h2>
                      <span className="badge badge-user">User</span>
                      Users
                    </h2>
                    <span className="role-count">{regularUsers.length} {regularUsers.length === 1 ? 'user' : 'users'}</span>
                  </div>
                  <div className="user-cards-grid">
                    {regularUsers.map(renderUserCard)}
                  </div>
                </div>
              )}

              {/* No users message */}
              {users.length === 0 && (
                <div className="no-users">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
                <button className="btn-close" onClick={handleCancel}>✕</button>
              </div>
              
              <form onSubmit={handleSave}>
                {/* Show limited fields for regular Users editing themselves */}
                {hasLimitedEditPermissions() && editingUser?.id === user.id ? (
                  <>
                    <div className="info-box" style={{ marginBottom: '20px' }}>
                      <p><strong>Note:</strong> You can only edit your email and password.</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password (optional)"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Full form for Admin and Manager */}
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">
                        Password {editingUser && '(leave blank to keep current)'}
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                        placeholder={editingUser ? 'Enter new password (optional)' : 'Enter password'}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="User">User</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin" disabled={!isAdmin()}>
                          Admin {!isAdmin() && '(Admin only)'}
                        </option>
                      </select>
                      {!isAdmin() && formData.role === 'Admin' && (
                        <small style={{color: '#e53e3e', marginTop: '4px', display: 'block'}}>
                          Only administrators can set or change roles to Admin
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;

