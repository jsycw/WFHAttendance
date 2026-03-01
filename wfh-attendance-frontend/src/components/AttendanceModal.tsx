import { useEffect, useState } from "react";

function AttendanceModal({
  form,
  attendance,
  onClose
}: any) {

  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");

  const [filtered,setFiltered]=useState<any[]>([]);
  const [page,setPage]=useState(1);

  const perPage=6;


  // default date
  useEffect(()=>{

    const now=new Date();

    const firstDay=
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
      .toISOString()
      .split("T")[0];

    const today=
      new Date()
      .toISOString()
      .split("T")[0];

    setDateFrom(firstDay);
    setDateTo(today);

  },[]);


  // filter
  useEffect(()=>{

    let result=attendance;

    if(dateFrom){

      const from=new Date(dateFrom);

      result=result.filter((a:any)=>
        new Date(a.checkin_time)>=from
      );

    }

    if(dateTo){

      const to=new Date(dateTo);

      result=result.filter((a:any)=>
        new Date(a.checkin_time)<=to
      );

    }

    setFiltered(result);

    setPage(1);

  },[dateFrom,dateTo,attendance]);


  // pagination
  const start=(page-1)*perPage;

  const paginated=
    filtered.slice(start,start+perPage);

  const totalPages=
    Math.ceil(filtered.length/perPage);


  // attendance rate
  const workingDays=
    getWorkingDays(dateFrom,dateTo);

  const rate=
    workingDays===0
    ?0
    :Math.round(
      (filtered.length/workingDays)*100
    );


  return(

    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

      <div className="bg-white w-175 rounded-xl shadow-lg">


        {/* HEADER */}
        <div className="flex justify-between p-4 border-b">

          <div>

            <h2 className="font-bold text-lg">
              Attendance Analytics
            </h2>

            <p className="text-gray-500">
              {form.name}
            </p>

          </div>

          <button onClick={onClose}>
            ✕
          </button>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b">

          <Stat title="Attendance" value={filtered.length}/>
          <Stat title="Working Days" value={workingDays}/>
          <Stat title="Rate" value={`${rate}%`}/>

        </div>


        {/* FILTER */}
        <div className="flex gap-2 p-4 border-b">

          <input
            type="date"
            value={dateFrom}
            onChange={(e)=>setDateFrom(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e)=>setDateTo(e.target.value)}
            className="border p-2 rounded"
          />

        </div>


        {/* TABLE */}
        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {paginated.map((a:any)=>(

              <tr key={a.id} className="border-t">

                <td className="p-3">

                  {new Date(a.checkin_time)
                  .toLocaleDateString()}

                </td>

                <td className="p-3">

                  {new Date(a.checkin_time)
                  .toLocaleTimeString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* PAGINATION */}
        <div className="p-4 flex gap-2">

          {Array.from(
            {length:totalPages},
            (_,i)=>(

            <button
              key={i}
              onClick={()=>setPage(i+1)}
              className="border px-3 py-1 rounded"
            >
              {i+1}
            </button>

          ))}

        </div>


      </div>

    </div>

  );

}

export default AttendanceModal;



function Stat({title,value}:any){

  return(

    <div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-xl font-bold">
        {value}
      </p>

    </div>

  );

}



function getWorkingDays(from:string,to:string){

  if(!from||!to)return 0;

  let count=0;

  const start=new Date(from);
  const end=new Date(to);

  for(
    let d=new Date(start);
    d<=end;
    d.setDate(d.getDate()+1)
  ){

    const day=d.getDay();

    if(day!==0&&day!==6)
      count++;

  }

  return count;

}