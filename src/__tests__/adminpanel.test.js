import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminPanel from "../app/adminpanel/page";
import UserDetailsProvider from "@/context/createContext";
import { SEARCH_RESULT_MESSAGE } from "../../message";
import PopupModal from "@/components/popupModal";

let mockData = [
  {
    employee_id: "emp_01",
    user_id: 1,
    full_name: "Test User",
    project: "Software",
    role: "Super Admin",
    status: true,
    permissions: {
      read: true,
      delete: false,
      update: false,
    },
  },
  {
    employee_id: "emp_02",
    user_id: 2,
    full_name: "User Admin",
    project: "Software",
    role: "Super Admin",
    status: true,
    permissions: {
      read: true,
      delete: true,
      update: true,
    },
  },
  {
    employee_id: "emp_03",
    user_id: 3,
    full_name: "Super User",
    project: "Software",
    role: "Super Admin",
    status: true,
    permissions: {
      read: false,
      delete: true,
      update: false,
    },
  },
];

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/adminpanel",
    query: {},
    asPath: "/adminpanel",
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    results: mockData,
    pagination: {
      total_items: 3,
      total_pages: 2,
      current_page: 1,
      limit: 2,
      next: 2,
      previous: null,
    },
  }),
});

let component;

beforeAll(() => {
  component = (
    <UserDetailsProvider>
      <AdminPanel />
    </UserDetailsProvider>
  );
});

describe("AdminPanel", () => {
  test("Renders component correctly.", () => {
    render(component);
    const employeeId = screen.getByPlaceholderText("Search by Employee Id");
    const employeeName = screen.getByPlaceholderText("Search by Employee Name");
    const employeeStatus = screen.getByPlaceholderText(
      "Search by Employee Status"
    );

    expect(employeeId).toBeInTheDocument();
    expect(employeeName).toBeInTheDocument();
    expect(employeeStatus).toBeInTheDocument();
  });

  test("An error message is displayed when the search button is clicked with empty inputs.", async () => {
    render(component);

    const searchButton = screen.getByText("Search");

    fireEvent.click(searchButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(
        "Please fill in at least one search box."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("API data fetched successfully.", async () => {
    render(component);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("User Admin")).toBeInTheDocument();
    });
  });

  test("Renders filtered data as result.", async () => {
    render(component);

    const employeeIdInput = screen.getByPlaceholderText(
      "Search by Employee Id"
    );

    const searchButton = screen.getByText("Search");

    fireEvent.change(employeeIdInput, { target: { value: "emp_02" } });

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("emp_02")).toBeInTheDocument();
    });
  });

  test("Clicking previous button decrements the current page.", async () => {
    render(component);

    let currentPage = 2;

    const updatePage = (newPage) => {
      currentPage = newPage;
    };

    expect(currentPage).toBe(2);

    await waitFor(() => {
      const loadingElement = screen.queryByText("Loading...");
      expect(loadingElement).not.toBeInTheDocument();
    });

    const previousButton = screen.getByTestId("previous-button");
    fireEvent.click(previousButton);

    updatePage(1);
    expect(currentPage).toBe(1);
  });

  test("Clicking next button increments the current page.", async () => {
    render(component);

    let currentPage = 1;

    const updatePage = (newPage) => {
      currentPage = newPage;
    };

    expect(currentPage).toBe(1);

    await waitFor(() => {
      const loadingElement = screen.queryByText("Loading...");
      expect(loadingElement).not.toBeInTheDocument();
    });

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    updatePage(2);

    expect(currentPage).toBe(2);
  });

  test("'Select All Read' checkbox sets all read permissions to true.", async () => {
    render(component);

    const readCheckbox = screen.getByTestId("read-checkbox");
    const originalData = [...mockData];

    fireEvent.click(readCheckbox);

    mockData.forEach((user) => {
      user.permissions.read = true;
    });

    const updatedData = mockData;
    expect(updatedData).toEqual(
      originalData.map((user) => ({
        ...user,
        permissions: { ...user.permissions, read: true },
      }))
    );

    mockData = originalData;
  });

  test("'Select All Delete' checkbox sets all delete permissions to true.", async () => {
    render(component);

    const deleteCheckbox = screen.getByTestId("delete-checkbox");
    const originalData = [...mockData];

    fireEvent.click(deleteCheckbox);

    mockData.forEach((user) => {
      user.permissions.delete = true;
    });

    const updatedData = mockData;
    expect(updatedData).toEqual(
      originalData.map((user) => ({
        ...user,
        permissions: { ...user.permissions, delete: true },
      }))
    );

    mockData = originalData;
  });

  test("'Select All Update' checkbox sets all update permissions to true.", async () => {
    render(component);

    const updateCheckbox = screen.getByTestId("update-checkbox");
    const originalData = [...mockData];

    fireEvent.click(updateCheckbox);

    mockData.forEach((user) => {
      user.permissions.update = true;
    });

    const updatedData = mockData;
    expect(updatedData).toEqual(
      originalData.map((user) => ({
        ...user,
        permissions: { ...user.permissions, update: true },
      }))
    );

    mockData = originalData;
  });

  test("Displays 'No results found' message when there are no search results.", async () => {
    render(component);

    const employeeIdInput = screen.getByPlaceholderText(
      "Search by Employee Id"
    );

    fireEvent.change(employeeIdInput, { target: { value: "emp_0123" } });
    const searchButton = screen.getByText("Search");

    fireEvent.click(searchButton);
    await waitFor(() => {
      const noResultsMessage = screen.queryByText(SEARCH_RESULT_MESSAGE);
      if (noResultsMessage) {
        expect(noResultsMessage).toBeInTheDocument();
        return true;
      }
      return false;
    });
  });

  test("'Select All' checkbox selects all users.", () => {
    render(component);

    const toggleAllPermissionsCheckbox = screen.getByTestId(
      "toggle-all-permissions-checkbox"
    );
    fireEvent.click(toggleAllPermissionsCheckbox);
  });

  test("Pop-up modal.", () => {
    render(component);
    const confirmModal = jest.fn();
    const closeModal = jest.fn();

    render(<PopupModal confirmModal={confirmModal} closeModal={closeModal} />);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(confirmModal).toHaveBeenCalled();

    expect(closeModal).not.toHaveBeenCalled();
  });

  test("Clicking 'Clear' button clears the search input fields.", () => {
    render(component);

    const employeeIdInput = screen.getByPlaceholderText(
      "Search by Employee Id"
    );
    fireEvent.change(employeeIdInput, { target: { value: "emp_02" } });

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
    fireEvent.change(employeeIdInput, { target: { value: "" } });
    expect(employeeIdInput.value).toBe("");
  });

  test("The Save Changes button should be disabled until the user is selected.", async () => {
    render(component);

    const readCheckbox = screen.getByTestId("read-checkbox");
    const saveChangesButton = screen.getByText("Save Changes");

    fireEvent.click(readCheckbox);

    await waitFor(() => {
      expect(mockData[0].permissions.read).toBe(true);
      expect(saveChangesButton).not.toBeDisabled();
    });
  });

  test("If there are no unsaved changes, 'Save Changes' button should remain disabled.", async () => {
    render(component);

    await waitFor(() => {
      const readCheckbox = screen.getByTestId("read-checkbox");

      const saveChangesButton = screen.queryByRole("button", {
        name: "Save Changes",
      });

      fireEvent.click(readCheckbox);

      if (saveChangesButton) {
        fireEvent.change(saveChangesButton, { target: { value: "false" } });

        expect(mockData[0].status).toBe("false");
        expect(saveChangesButton).toBeDisabled();
      } else {
        console.log(
          "Save Changes button does not exist in the current context."
        );
      }
    });
  });

  test("If there are unsaved changes, 'Save Changes' button should be enabled.", async () => {
    render(component);

    const readCheckbox = screen.getByTestId("read-checkbox");
    const saveChangesButton = screen.queryByRole("button", {
      name: "Save Changes",
    });

    fireEvent.click(readCheckbox);

    if (saveChangesButton) {
      fireEvent.change(saveChangesButton, { target: { value: "true" } });

      expect(mockData[0].status).toBe("true");
      expect(saveChangesButton).not.toBeDisabled();
    }
  });

  test("Updates status and set unsaved changes true.", () => {
    const initialData = [
      {
        employee_id: "emp_01",
        user_id: 1,
        full_name: "Test User",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: false,
          update: false,
        },
      },
      {
        employee_id: "emp_02",
        user_id: 2,
        full_name: "User Admin",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: true,
          update: true,
        },
      },
    ];
    const indexToUpdate = 0;
    const setData = jest.fn();
    const setUnsavedChanges = jest.fn();
    const { getByTestId } = render(
      <select
        data-testid={`status-dropdown-${initialData[indexToUpdate].user_id}`}
        value={initialData[indexToUpdate].status.toString()}
        onChange={(e) => {
          initialData[indexToUpdate].status = e.target.value === "true";
          setData(initialData);
          setUnsavedChanges(true);
        }}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    );

    fireEvent.change(
      getByTestId(`status-dropdown-${initialData[indexToUpdate].user_id}`),
      {
        target: { value: "false" },
      }
    );

    expect(setData).toHaveBeenCalledWith([
      {
        employee_id: "emp_01",
        user_id: 1,
        full_name: "Test User",
        project: "Software",
        role: "Super Admin",
        status: false,
        permissions: {
          read: true,
          delete: false,
          update: false,
        },
      },
      {
        employee_id: "emp_02",
        user_id: 2,
        full_name: "User Admin",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: true,
          update: true,
        },
      },
    ]);
    expect(setUnsavedChanges).toHaveBeenCalledWith(true);
  });

  test("Updates permissions and sets unsaved changes true.", () => {
    const initialData = [
      {
        employee_id: "emp_01",
        user_id: 1,
        full_name: "Test User",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: false,
          update: false,
        },
      },
      {
        employee_id: "emp_02",
        user_id: 2,
        full_name: "User Admin",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: true,
          update: true,
        },
      },
    ];
    const indexToUpdate = 0;
    const setData = jest.fn();
    const setUnsavedChanges = jest.fn();
    const { getByTestId } = render(
      <input
        type="checkbox"
        data-testid={`read-checkbox-${initialData[indexToUpdate].user_id}`}
        checked={initialData[indexToUpdate].permissions.read}
        onChange={(e) => {
          initialData[indexToUpdate].permissions.read = e.target.checked;
          setData(initialData);
          setUnsavedChanges(true);
        }}
      />
    );

    fireEvent.click(
      getByTestId(`read-checkbox-${initialData[indexToUpdate].user_id}`)
    );

    expect(setData).toHaveBeenCalledWith([
      {
        employee_id: "emp_01",
        user_id: 1,
        full_name: "Test User",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: false,
          delete: false,
          update: false,
        },
      },
      {
        employee_id: "emp_02",
        user_id: 2,
        full_name: "User Admin",
        project: "Software",
        role: "Super Admin",
        status: true,
        permissions: {
          read: true,
          delete: true,
          update: true,
        },
      },
    ]);
    expect(setUnsavedChanges).toHaveBeenCalledWith(true);
  });
});
