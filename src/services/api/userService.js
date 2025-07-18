// Mock user service for role-based dashboard access
const mockUsers = [
  {
    Id: 1,
    name: "John Agent",
    email: "john.agent@company.com",
    role: "agent",
    permissions: ["view_all_quotes", "manage_products", "view_reports", "manage_customers"]
  },
  {
    Id: 2,
    name: "Jane Customer",
    email: "jane.customer@company.com",
    role: "customer",
    permissions: ["view_own_quotes", "request_quotes"]
  }
];

let currentUser = mockUsers[0]; // Default to agent for demo

const userService = {
  getCurrentUser: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...currentUser });
      }, 200);
    });
  },

  switchRole: (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.role === role);
        if (user) {
          currentUser = user;
          resolve({ ...currentUser });
        } else {
          throw new Error("Invalid role");
        }
      }, 200);
    });
  },

  hasPermission: (permission) => {
    return currentUser.permissions.includes(permission);
  },

  isAgent: () => {
    return currentUser.role === "agent";
  },

  isCustomer: () => {
    return currentUser.role === "customer";
  }
};

export { userService };