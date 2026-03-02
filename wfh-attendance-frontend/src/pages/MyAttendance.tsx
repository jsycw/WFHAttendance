import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { jwtDecode } from "jwt-decode";

function MyAttendance() {
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [checkedToday, setCheckedToday] = useState(false);
  const [checkinTime, setCheckinTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const loadAttendance = async () => {
    const res = await API.get("/attendance/my");
    const formatted = res.data.map((item: any) => ({
      title: "Present",
      date: item.checkin_time,
      extendedProps: item
    }));
    setEvents(formatted);
  };

  const loadToday = async () => {
    const res = await API.get("/attendance/today");
    if (res.data) {
      setCheckedToday(true);
      setCheckinTime(new Date(res.data.checkin_time).toLocaleString());
    }
  };

  useEffect(() => {
    loadAttendance();
    loadToday();
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const name =
        decoded.name ||
        decoded.fullname ||
        decoded.username ||
        "User";
      setUserName(name);
    }
    setGreeting(getGreeting());
  }, []);

  const handleCheckin = async () => {
    if (!file) return alert("Please upload photo first");
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);
    await API.post("/attendance/checkin", formData);
    setLoading(false);
    setFile(null);
    loadAttendance();
    loadToday();
  };

  const handleClick = (info: any) => {
    setSelected(info.event.extendedProps);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-gray-500">
              Track your attendance and daily check-in
            </p>
            <div className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">
              Daily Check-in
            </h2>

            {checkedToday ? (
              <div className="bg-green-100 text-green-700 p-3 rounded">
                ✅ Already checked in today
                <div className="text-sm">{checkinTime}</div>
              </div>
            ) : (
              <div className="max-w-md">
                <label className="border-2 border-dashed border-gray-300 p-4 rounded cursor-pointer block text-center hover:border-blue-500">
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files)
                        setFile(e.target.files[0]);
                    }}
                  />
                  Click to upload photo
                </label>

                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    {file.name}
                  </div>
                )}

                <button
                  onClick={handleCheckin}
                  disabled={loading}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "Submitting..." : "Check-in"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleClick}
            height={600}
          />
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div
              className="relative bg-white rounded-xl shadow-lg p-6 w-96"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-bold">Attendance Detail</h3>
                <button onClick={() => setSelected(null)}>✕</button>
              </div>
              <p className="mb-3">
                {new Date(selected.checkin_time).toLocaleString()}
              </p>
              <img
                src={`http://localhost:3000/uploads/${selected.photo}`}
                className="rounded"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyAttendance;