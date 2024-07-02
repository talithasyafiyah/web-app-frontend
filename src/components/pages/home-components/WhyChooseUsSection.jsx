import React from "react";

const Card = ({ icon, title, description }) => (
  <div className="card border-2 border-primary rounded-xl p-4 flex flex-col text-main">
    <div className="overflow-hidden">{icon}</div>
    <h3 className="mt-6 font-bold text-base md:text-lg">{title}</h3>
    <p className="mt-6 text-sm md:text-sm">{description}</p>
  </div>
);

const WhyChooseUs = () => {
  return (
    <div className="container text-main">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
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
            Mengapa Harus
          </span>
          <span className="text-xl md:text-2xl ml-2 font-bold text-primary">
            Pilih Kami?
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 mb-20">
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="0 0 20 20"
              className="text-secondary"
            >
              <path
                fill="currentColor"
                d="M8.904 7.197A3.5 3.5 0 0 1 11 6.5c.786 0 1.512.26 2.096.697l-1.08 1.08A2 2 0 0 0 11 8c-.37 0-.718.101-1.016.277zM13 10c0-.37-.101-.718-.277-1.016l1.08-1.08c.438.584.697 1.31.697 2.096s-.26 1.512-.697 2.096l-1.08-1.08A2 2 0 0 0 13 10m-2 2c.37 0 .718-.101 1.016-.277l1.08 1.08A3.5 3.5 0 0 1 11 13.5c-.786 0-1.512-.26-2.096-.697l1.08-1.08A2 2 0 0 0 11 12m-2-2c0 .37.101.718.277 1.016l-1.08 1.08A3.5 3.5 0 0 1 7.5 10c0-.786.26-1.512.697-2.096l1.08 1.08A2 2 0 0 0 9 10M6.101 5A6.98 6.98 0 0 0 4 10c0 1.074.242 2.09.674 3H3.5a.5.5 0 0 0 0 1h1.755q.377.54.846 1H1.5a.5.5 0 0 0 0 1h5.892a7 7 0 1 0 0-12H2.5a.5.5 0 0 0 0 1zM11 9a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
              ></path>
            </svg>
          }
          title="Mudah dan Cepat"
          description="Proses pembelian tiket kami dirancang untuk memberikan kemudahan dan kecepatan, sehingga Anda bisa mendapatkan tiket hanya dalam beberapa klik saja."
        />
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="0 0 24 24"
              className="text-green-700"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m16.137 4.728l1.83 1.83C20.656 9.248 22 10.592 22 12.262c0 1.671-1.344 3.015-4.033 5.704c-2.69 2.69-4.034 4.034-5.705 4.034c-1.67 0-3.015-1.344-5.704-4.033l-1.83-1.83c-1.545-1.546-2.318-2.318-2.605-3.321c-.288-1.003-.042-2.068.45-4.197l.283-1.228c.413-1.792.62-2.688 1.233-3.302c.614-.613 1.51-.82 3.302-1.233l1.228-.284c2.13-.491 3.194-.737 4.197-.45c1.003.288 1.775 1.061 3.32 2.606m-4.99 9.6c-.673-.672-.668-1.638-.265-2.403a.75.75 0 0 1 1.04-1.046c.34-.18.713-.276 1.085-.272a.75.75 0 0 1-.014 1.5a.88.88 0 0 0-.609.277c-.387.387-.286.775-.177.884c.11.109.497.21.884-.177c.784-.784 2.138-1.044 3.005-.177c.673.673.668 1.639.265 2.404a.75.75 0 0 1-1.04 1.045a2.201 2.201 0 0 1-1.472.232a.75.75 0 1 1 .302-1.47c.177.037.463-.021.708-.266c.387-.388.286-.775.177-.884c-.11-.109-.497-.21-.884.177c-.784.784-2.138 1.044-3.005.176m-1.126-4.035a2 2 0 1 0-2.829-2.828a2 2 0 0 0 2.829 2.828"
                clipRule="evenodd"
              ></path>
            </svg>
          }
          title="Harga Terbaik"
          description="Kami menawarkan harga kompetitif dan berbagai promo menarik yang akan membuat perjalanan Anda lebih terjangkau."
        />
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="0 0 24 24"
              className="text-red-700"
            >
              <path
                fill="currentColor"
                d="M12.005 13.003a3 3 0 0 1 2.08 5.162l-1.91 1.837h2.83v2h-6l-.001-1.724l3.694-3.555a1 1 0 1 0-1.693-.72h-2a3 3 0 0 1 3-3m6 0v4h2v-4h2v9h-2v-3h-4v-6zm-14-1a7.985 7.985 0 0 0 3 6.246v2.416a9.996 9.996 0 0 1-5-8.662zm8-10c5.185 0 9.449 3.946 9.95 9h-2.012a8.001 8.001 0 0 0-14.554-3.5h2.616v2h-6v-6h2v2.499a9.985 9.985 0 0 1 8-4"
              ></path>
            </svg>
          }
          title="Layanan Pelanggan 24/7"
          description="Tim layanan pelanggan kami siap membantu Anda kapan saja, memastikan Anda mendapatkan pengalaman terbaik."
        />
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="0 0 24 24"
              className="text-primary"
            >
              <g fill="none" fillRule="evenodd">
                <path d="M24 0v24H0V0z"></path>
                <path
                  fill="currentColor"
                  d="M11.298 2.195a2 2 0 0 1 1.232-.055l.172.055l7 2.625a2 2 0 0 1 1.291 1.708l.007.165v5.363a9 9 0 0 1-4.709 7.911l-.266.139l-3.354 1.677a1.5 1.5 0 0 1-1.198.062l-.144-.062l-3.354-1.677a9 9 0 0 1-4.97-7.75l-.005-.3V6.693a2 2 0 0 1 1.145-1.808l.153-.065zm4.135 6.434l-4.598 4.598l-1.768-1.768a1 1 0 0 0-1.414 1.415l2.404 2.404a1.1 1.1 0 0 0 1.556 0l5.234-5.235a1 1 0 1 0-1.414-1.414"
                ></path>
              </g>
            </svg>
          }
          title="Keamanan Terjamin"
          description="Keamanan transaksi online adalah prioritas utama kami, sehingga Anda dapat membeli tiket dengan rasa aman dan nyaman."
        />
      </div>
    </div>
  );
};

export default WhyChooseUs;
