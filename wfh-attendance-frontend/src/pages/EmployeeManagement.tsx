import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import AttendanceModal from "../components/AttendanceModal";

function EmployeeManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState<any>({
    id: null,
    name: "",
    email: "",
    department: "",
    role: "employee"
  });

  const loadEmployees = async () => {
    const res = await API.get("/employee");
    setEmployees(res.data);
    setFiltered(res.data);
  };

  useEffect(() => { loadEmployees(); }, []);

  useEffect(() => {
    let data = employees;
    if (search)
      data = data.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase())
      );
    if (roleFilter !== "all")
      data = data.filter(emp => emp.role === roleFilter);
    setFiltered(data);
    setPage(1);
  }, [search, roleFilter, employees]);

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const saveEmployee = async () => {
    if (form.id)
      await API.put(`/employee/${form.id}`, form);
    else
      await API.post("/employee", { ...form, password: "123456" });
    setShowModal(false);
    loadEmployees();
  };

  const deleteEmployee = async (id: number) => {
    if (confirm("Delete employee?")) {
      await API.delete(`/employee/${id}`);
      loadEmployees();
    }
  };

  const viewAttendance = async (emp: any) => {
    const res = await API.get("/attendance/all");
    const empAttendance = res.data.filter((a: any) => a.employee.id === emp.id);
    setAttendance(empAttendance);
    setForm(emp);
    setShowAttendanceModal(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Employee</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Employee
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <input
            placeholder="Search employee..."
            className="border p-2 rounded w-64"
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="employee">Employee</option>
            <option value="hrd">HRD</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4">{emp.email}</td>
                  <td className="p-4">{emp.department}</td>
                  <td className="p-4">
                    <RoleBadge role={emp.role} />
                  </td>
                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => viewAttendance(emp)}
                      className="text-green-600 hover:underline"
                    >
                      Attendance
                    </button>
                    <button
                      onClick={() => {
                        setForm(emp);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          form={form}
          setForm={setForm}
          onClose={() => setShowModal(false)}
          onSave={saveEmployee}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal
          form={form}
          attendance={attendance}
          onClose={() => setShowAttendanceModal(false)}
        />
      )}
    </Layout>
  );
}

export default EmployeeManagement;

function RoleBadge({ role }: any) {
  const color =
    role === "hrd"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  return (
    <span className={`${color} px-2 py-1 rounded text-sm`}>
      {role}
    </span>
  );
}

function EmployeeModal({ form, setForm, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="font-bold mb-4">Employee</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          placeholder="Department"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          className="border p-2 w-full mb-4"
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full mb-4"
        >
          <option value="employee">Employee</option>
          <option value="hrd">HRD</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}