import react from "react";

function DetailPemesanan() {
  return (
    <>
      {" "}
      {/* Pemilihan Tempat Duduk */}
      <div className="mb-5">
        {/* Data Pemesan  */}
        <div className="rounded-xl p-[32px] shadow-md">
          <p className="text-xl  mb-[32px]">
            <strong>Pilih Kursi (Ekonomi)</strong>
          </p>
          {/* Formulir  */}
          <div>
            <div className="">
              <div className="flex justify-between">
                {/* kiri  */}
                <div className="flex flex-col justify-between w-1/3">
                  <div className="flex justify-around">
                    {FirstRows.map((row, index) => (
                      <p className="p-4" key={index}>
                        {row}
                      </p>
                    ))}
                  </div>
                  <div className="flex">
                    {" "}
                    {Rows.slice(0, Math.ceil(Rows.length / 2)).map((row) => (
                      <div
                        key={row}
                        className="text-center p-2 flex flex-col gap-3"
                      >
                        {KursiByRows[row].map((seat) => (
                          <button
                            key={seat}
                            className={`p-4 w-14 border rounded ${
                              IsClick === seat
                                ? "bg-[#00A8D0] "
                                : "bg-slate-300"
                            }`}
                            onClick={() => HandleClick(seat)}
                            value={seat}
                          >
                            {seat}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* tengah  */}
                <div className="flex flex-col justify-center items-center  w-1/3">
                  <div className="p-7"></div>
                  <div className="flex flex-col gap-3">
                    {" "}
                    {Columns.map((row) => (
                      <p className="py-4 px-3 text-center bg-slate-100 rounded-xl border">
                        {row}
                      </p>
                    ))}
                  </div>
                </div>
                {/* kanan  */}
                <div className="flex flex-col justify-between w-1/3">
                  <div className="flex justify-around">
                    {EndRows.map((row, index) => (
                      <p className=" p-4 " key={index}>
                        {row}
                      </p>
                    ))}
                  </div>
                  <div className="flex">
                    {" "}
                    {Rows.slice(Math.ceil(Rows.length / 2)).map((row) => (
                      <div
                        key={row}
                        className="text-center p-2 flex flex-col lg:gap-3"
                      >
                        {KursiByRows[row].map((seat) => (
                          <button
                            key={seat}
                            className={`p-4 w-14 border rounded ${
                              IsClick === seat ? "bg-[#00A8D0]" : "bg-slate-300"
                            }`}
                            onClick={() => HandleClick(seat)}
                            value={seat}
                          >
                            {seat}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPemesanan;
