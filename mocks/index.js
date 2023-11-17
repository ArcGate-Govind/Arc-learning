export const USER_DATAILS = {
  message: "success",
  code: 200,
  projects: [
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "govind dev soni",
      project: "DRF",
      role: "Super Admin",
      status: false,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "gjtk",
      project: "Test",
      role: "Agent",
      status: true,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "thgt",
      project: "amazon",
      role: "Agent",
      status: true,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
  ],
};
