import usersData from '../data/users.json';
import adminsData from '../data/admins.json';
import rolesData from '../data/roles.json';
import subscriptionsData from '../data/subscriptions.json';
import verificationsData from '../data/verifications.json';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

let users = JSON.parse(JSON.stringify(usersData));
let admins = JSON.parse(JSON.stringify(adminsData));
let roles = JSON.parse(JSON.stringify(rolesData));
let subscriptions = JSON.parse(JSON.stringify(subscriptionsData));
let verifications = JSON.parse(JSON.stringify(verificationsData));

// ROLES ENDPOINTS
export const roleAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(roles));
  },

  getById: async (id) => {
    await delay();
    const role = roles.find(r => r.role_id === id);
    if (!role) throw new Error('Role not found');
    return JSON.parse(JSON.stringify(role));
  },

  create: async (data) => {
    await delay();
    const newRole = {
      role_id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    roles.push(newRole);
    return JSON.parse(JSON.stringify(newRole));
  },

  update: async (id, data) => {
    await delay();
    const index = roles.findIndex(r => r.role_id === id);
    if (index === -1) throw new Error('Role not found');

    roles[index] = {
      ...roles[index],
      ...data,
      role_id: roles[index].role_id,
      created_at: roles[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(roles[index]));
  },

  delete: async (id) => {
    await delay();
    const index = roles.findIndex(r => r.role_id === id);
    if (index === -1) throw new Error('Role not found');
    roles.splice(index, 1);
    return { success: true, message: 'Role deleted' };
  },
};

// USER ENDPOINTS
export const userAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(users));
  },

  getById: async (id) => {
    await delay();
    const user = users.find(u => u.user_id === id);
    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  },

  create: async (userData) => {
    await delay();
    const newUser = {
      user_id: Date.now().toString(),
      ...userData,
      role_id: userData.role_id || '3',
      created_at: new Date().toISOString(),
      last_login_at: null,
    };
    users.push(newUser);
    return JSON.parse(JSON.stringify(newUser));
  },

  update: async (id, userData) => {
    await delay();
    const index = users.findIndex(u => u.user_id === id);
    if (index === -1) throw new Error('User not found');

    users[index] = {
      ...users[index],
      ...userData,
      user_id: users[index].user_id,
      created_at: users[index].created_at,
    };
    return JSON.parse(JSON.stringify(users[index]));
  },

  delete: async (id) => {
    await delay();
    const index = users.findIndex(u => u.user_id === id);
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
    return { success: true, message: 'User deleted' };
  },
};

// SUBSCRIPTIONS ENDPOINTS
export const subscriptionAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(subscriptions));
  },

  getByUserId: async (userId) => {
    await delay();
    const userSubscriptions = subscriptions.filter(s => s.user_id === userId);
    return JSON.parse(JSON.stringify(userSubscriptions));
  },

  getById: async (id) => {
    await delay();
    const subscription = subscriptions.find(s => s.subscription_id === id);
    if (!subscription) throw new Error('Subscription not found');
    return JSON.parse(JSON.stringify(subscription));
  },

  create: async (data) => {
    await delay();
    const newSubscription = {
      subscription_id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    subscriptions.push(newSubscription);
    return JSON.parse(JSON.stringify(newSubscription));
  },

  update: async (id, data) => {
    await delay();
    const index = subscriptions.findIndex(s => s.subscription_id === id);
    if (index === -1) throw new Error('Subscription not found');

    subscriptions[index] = {
      ...subscriptions[index],
      ...data,
      subscription_id: subscriptions[index].subscription_id,
      created_at: subscriptions[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(subscriptions[index]));
  },

  delete: async (id) => {
    await delay();
    const index = subscriptions.findIndex(s => s.subscription_id === id);
    if (index === -1) throw new Error('Subscription not found');
    subscriptions.splice(index, 1);
    return { success: true, message: 'Subscription deleted' };
  },
};

// ADMIN ENDPOINTS
export const adminAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(admins));
  },

  getById: async (id) => {
    await delay();
    const admin = admins.find(a => a.admin_id === id);
    if (!admin) throw new Error('Admin not found');
    return JSON.parse(JSON.stringify(admin));
  },

  create: async (adminData) => {
    await delay();
    const newAdmin = {
      admin_id: Date.now().toString(),
      ...adminData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    admins.push(newAdmin);
    return JSON.parse(JSON.stringify(newAdmin));
  },

  update: async (id, adminData) => {
    await delay();
    const index = admins.findIndex(a => a.admin_id === id);
    if (index === -1) throw new Error('Admin not found');

    admins[index] = {
      ...admins[index],
      ...adminData,
      admin_id: admins[index].admin_id,
      created_at: admins[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(admins[index]));
  },

  delete: async (id) => {
    await delay();
    const index = admins.findIndex(a => a.admin_id === id);
    if (index === -1) throw new Error('Admin not found');
    admins.splice(index, 1);
    return { success: true, message: 'Admin deleted' };
  },

  login: async (credentials) => {
    await delay();
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password required');
    }
    return { success: true, message: 'Login successful', token: 'sample-token-123' };
  },
};

// VERIFICATIONS ENDPOINTS
export const verificationAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(verifications));
  },

  getById: async (id) => {
    await delay();
    const verification = verifications.find(v => v.verification_id === id);
    if (!verification) throw new Error('Verification not found');
    return JSON.parse(JSON.stringify(verification));
  },

  getByStatus: async (status) => {
    await delay();
    const filtered = verifications.filter(v => v.status === status);
    return JSON.parse(JSON.stringify(filtered));
  },

  create: async (data) => {
    await delay();
    const newVerification = {
      verification_id: Date.now().toString(),
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    verifications.push(newVerification);
    return JSON.parse(JSON.stringify(newVerification));
  },

  update: async (id, data) => {
    await delay();
    const index = verifications.findIndex(v => v.verification_id === id);
    if (index === -1) throw new Error('Verification not found');

    verifications[index] = {
      ...verifications[index],
      ...data,
      verification_id: verifications[index].verification_id,
      created_at: verifications[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(verifications[index]));
  },

  approve: async (id, reviewComment = '') => {
    await delay();
    const index = verifications.findIndex(v => v.verification_id === id);
    if (index === -1) throw new Error('Verification not found');

    verifications[index] = {
      ...verifications[index],
      status: 'approved',
      review_comment: reviewComment,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(verifications[index]));
  },

  reject: async (id, reviewComment) => {
    await delay();
    const index = verifications.findIndex(v => v.verification_id === id);
    if (index === -1) throw new Error('Verification not found');

    if (!reviewComment) throw new Error('Review comment is required for rejection');

    verifications[index] = {
      ...verifications[index],
      status: 'rejected',
      review_comment: reviewComment,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(verifications[index]));
  },

  delete: async (id) => {
    await delay();
    const index = verifications.findIndex(v => v.verification_id === id);
    if (index === -1) throw new Error('Verification not found');
    verifications.splice(index, 1);
    return { success: true, message: 'Verification deleted' };
  },
};
