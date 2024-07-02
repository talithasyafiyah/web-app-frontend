/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michael Foster",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  // More people...
];

export default function AboutUs() {
  return (
    <div className="bg-white my-20 overflow-x-hidden overflow-y-hidden" id="tentang-kami-section">
      <div className="w-full h-[600px] md:h-[400px] relative">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

        {/* Title*/}
        <div className="absolute top-[25%] left-[30%] w-full flex flex-col items-center justify-center p-4 z-20 overflow-x-hidden">
          <div className="bg-white py-8 pl-8 pr-40 rounded-lg shadow-lg w-[400px] md:w-[800px]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between -mt-3">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={40}
                  height={40}
                  viewBox="0 0 10 10"
                  className="text-secondary"
                >
                  <path fill="currentColor" d="M0 7h16v1H0z"></path>
                </svg>
                <span className="text-xl md:text-2xl font-bold text-main">
                  Tentang
                </span>
                <span className="text-xl md:text-2xl ml-2 font-bold text-primary">
                  Kami
                </span>
              </div>
            </div>
            <p className="text-main font-medium text-sm text-left mt-4">
              Aviatick adalah platform terpercaya untuk memesan tiket pesawat
              dengan berbagai pilihan penerbangan dan harga terbaik. Kami
              menawarkan pengalaman pemesanan yang cepat, aman, dan efisien
              dengan antarmuka ramah pengguna dan dukungan 24/7. Dapatkan
              pilihan penerbangan dari maskapai terkemuka dengan promo dan
              diskon eksklusif hanya di Aviatick.
            </p>
          </div>
        </div>
        <div
          className="h-[600px] md:h-[400px] relative"
        >
          <img
            className="w-full h-[600px] md:h-[400px] object-cover"
            src="/bg/plane.jpg"
            alt="Tentang kami"
          />
        </div>
      </div>
    </div>
  );
}
