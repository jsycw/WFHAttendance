import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function Dashboard() {

  // =========================
  // STATE
  // =========================

  const [attendance, setAttendance] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalEmployee: 0,
    checkedInToday: 0,
    absentToday: 0,
    attendanceRate: 0
  });

  const [search, setSearch] = useState("");

  // date filter
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [selected, setSelected] = useState<any>(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // DEFAULT DATE = TODAY
  // =========================

  useEffect(() => {

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setDateFrom(today);
    setDateTo(today);

  }, []);



  // =========================
  // LOAD DATA FROM BACKEND
  // =========================

  const loadData = async () => {

    try {

      setLoading(true);

      const attendanceRes =
        await API.get("/attendance/all");

      const statsRes =
        await API.get("/attendance/stats");

      setAttendance(attendanceRes.data);

      setStats(statsRes.data);

    }
    catch (err) {

      console.error(err);

      alert("Failed load dashboard");

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadData();

  }, []);



  // =========================
  // FILTER LOGIC (DATE + SEARCH)
  // =========================

  useEffect(() => {

    let result = attendance;

    // filter FROM
    if (dateFrom) {

      const from = new Date(dateFrom);
      from.setHours(0,0,0,0);

      result = result.filter(item =>
        new Date(item.checkin_time) >= from
      );

    }

    // filter TO
    if (dateTo) {

      const to = new Date(dateTo);
      to.setHours(23,59,59,999);

      result = result.filter(item =>
        new Date(item.checkin_time) <= to
      );

    }

    // search
    if (search) {

      result = result.filter(item =>
        item.employee.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    setFiltered(result);

    setPage(1);

  }, [attendance, search, dateFrom, dateTo]);



  // =========================
  // PAGINATION
  // =========================

  const start = (page - 1) * perPage;

  const paginated =
    filtered.slice(start, start + perPage);

  const totalPages =
    Math.ceil(filtered.length / perPage);



  // =========================
  // LOADING UI
  // =========================

  if (loading) {

    return (

      <Layout>

        <div className="p-10 text-center">
          Loading dashboard...
        </div>

      </Layout>

    );

  }



  // =========================
  // MAIN UI
  // =========================

  return (

    <Layout>

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">
          Attendance Data
        </h2>


        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}

        <div className="grid grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Employee"
            value={stats.totalEmployee}
            color="blue"
          />

          <StatCard
            title="Checked-in Today"
            value={stats.checkedInToday}
            color="green"
          />

          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            color="red"
          />

          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            color="purple"
          />

        </div>



        {/* ========================= */}
        {/* FILTER */}
        {/* ========================= */}

        <div className="flex gap-4 mb-4 items-end flex-wrap">

          {/* SEARCH */}
          <div>

            <label className="text-sm text-gray-500">
              Search
            </label>

            <input
              placeholder="Employee name"
              className="border p-2 rounded block"
              onChange={(e)=>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* FROM DATE */}
          <div>

            <label className="text-sm text-gray-500">
              From
            </label>

            <input
              type="date"
              value={dateFrom}
              className="border p-2 rounded block"
              onChange={(e)=>
                setDateFrom(e.target.value)
              }
            />

          </div>


          {/* TO DATE */}
          <div>

            <label className="text-sm text-gray-500">
              To
            </label>

            <input
              type="date"
              value={dateTo}
              className="border p-2 rounded block"
              onChange={(e)=>
                setDateTo(e.target.value)
              }
            />

          </div>


          {/* RESET */}
          <button
            onClick={()=>{
              setSearch("");
              setDateFrom("");
              setDateTo("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>

        </div>



        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Employee
                </th>

                <th className="p-4 text-left">
                  Department
                </th>

                <th className="p-4 text-left">
                  Time
                </th>

                <th className="p-4 text-left">
                  Photo
                </th>

              </tr>

            </thead>


            <tbody>

              {paginated.length === 0 && (

                <tr>

                  <td colSpan={4}
                    className="text-center p-6 text-gray-500">

                    No data

                  </td>

                </tr>

              )}


              {paginated.map(item => (

                <tr key={item.id}
                  className="border-t hover:bg-gray-50">

                  <td className="p-4">

                    <div className="font-medium">
                      {item.employee.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {item.employee.email}
                    </div>

                  </td>


                  <td className="p-4">
                    {item.employee.department || "-"}
                  </td>


                  <td className="p-4">

                    {new Date(
                      item.checkin_time
                    ).toLocaleString()}

                  </td>


                  <td className="p-4">

                    <img
                      src={`http://localhost:3000/uploads/${item.photo}`}
                      className="w-16 rounded cursor-pointer hover:scale-105"
                      onClick={()=>setSelected(item)}
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>



        {/* ========================= */}
        {/* PAGINATION */}
        {/* ========================= */}

        <div className="flex gap-2 mt-4">

          {Array.from(
            { length: totalPages },
            (_, i) => (

              <button
                key={i}
                onClick={()=>setPage(i+1)}
                className={`px-3 py-1 border rounded ${
                  page === i+1
                    ? "bg-blue-600 text-white"
                    : ""
                }`}
              >
                {i+1}
              </button>

          ))}

        </div>


      </div>


      {/* MODAL */}

      {selected &&
        <Modal
          item={selected}
          onClose={()=>setSelected(null)}
        />
      }

    </Layout>

  );

}


export default Dashboard;



// =========================
// STAT CARD
// =========================

function StatCard({title,value,color}:any){

  const colors:any={
    blue:"text-blue-600",
    green:"text-green-600",
    red:"text-red-600",
    purple:"text-purple-600"
  };

  return(

    <div className="bg-white p-4 rounded-xl shadow">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </h3>

    </div>

  );

}



// =========================
// MODAL
// =========================

function Modal({item,onClose}:any){

  return(

    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div
        className="bg-white p-6 rounded relative"
        onClick={(e)=>e.stopPropagation()}
      >

        <h3 className="font-bold mb-2">
          {item.employee.name}
        </h3>

        <img
          src={`http://localhost:3000/uploads/${item.photo}`}
          className="rounded max-w-md"
        />

        <button
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>

  );

}