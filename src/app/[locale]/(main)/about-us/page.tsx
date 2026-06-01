import Image from "next/image";
import { InfoSection } from "../(homepage)/_components/_sections/info";

const newsList = [
  {
    title: "Bulky.id Buka Gudang Baru",
    excerpt:
      "Bulky.id resmi membuka gudang baru untuk mempercepat distribusi ke berbagai wilayah.",
    date: "12 Agustus 2025",
    image: "/assets/images/about-us/warehouse-vibe.svg",
  },
  {
    title: "Kemitraan Logistik Diperluas",
    excerpt:
      "Kolaborasi baru memperkuat rantai pasok dan meningkatkan efisiensi pengiriman.",
    date: "10 Agustus 2025",
    image: "/assets/images/about-us/people-in-warehouse.svg",
  },
  {
    title: "Reseller UMKM Bertumbuh",
    excerpt:
      "Ribuan pelaku usaha memanfaatkan stok likuidasi untuk memperbesar bisnisnya.",
    date: "08 Agustus 2025",
    image: "/assets/images/about-us/people-left.svg",
  },
  {
    title: "Teknologi Sortir Makin Cepat",
    excerpt:
      "Bulky terus meningkatkan akurasi dan kecepatan proses sortir di gudang.",
    date: "05 Agustus 2025",
    image: "/assets/images/about-us/people-right.svg",
  },
];

const AboutPage = () => {
  return (
    <main className="w-full overflow-hidden bg-white">
      {/* 1) Tentang Kami + 3 card */}
      <section className="relative mx-auto w-full max-w-[1280px] bg-[#f2f2f2] px-4 pb-16 pt-8 md:px-8 lg:px-12">
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-top.svg"
          alt="Bulky top watermark"
          width={780}
          height={260}
          className="pointer-events-none absolute left-1/2 top-20 hidden w-[66%] max-w-[780px] -translate-x-1/2 lg:block"
        />
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-bottom.svg"
          alt="Bulky bottom watermark"
          width={1288}
          height={308}
          className="pointer-events-none absolute bottom-0 left-1/2 hidden w-full max-w-[1288px] -translate-x-1/2 lg:block"
        />

        <div className="relative z-10">
          <p className="mb-8 text-center text-[36px] font-light text-black">
            Tentang Kami
          </p>

          <div className="grid items-start gap-6 md:grid-cols-3">
            <article className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              <div className="flex h-[265px] items-end justify-center bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-left.svg"
                  alt="Tentang kami kiri"
                  width={280}
                  height={309}
                  className="h-auto max-h-[250px] w-auto"
                />
              </div>
              <div className="h-6 bg-[#ffec9a]" />
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  Kami berkomitmen menciptakan ekosistem bisnis yang
                  berkelanjutan, transparan, dan saling menguntungkan, antara
                  ritel, mitra logistik, dan reseller di seluruh Indonesia.
                </p>
              </div>
            </article>

            <article className="mx-auto mt-6 w-full max-w-[380px] overflow-hidden rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] md:mt-10">
              <div className="flex h-[265px] items-end justify-center bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-wrapping-box.svg"
                  alt="Tentang kami tengah"
                  width={811}
                  height={583}
                  className="h-auto max-h-[250px] w-auto"
                />
              </div>
              <div className="h-6 bg-[#ffec9a]" />
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  <strong>Bulky.id</strong> adalah perusahaan likuidasi ritel
                  online pertama di Indonesia yang membantu bisnis mengelola
                  kelebihan stok, barang retur, dan produk gagal kirim secara
                  efisien.
                </p>
              </div>
            </article>

            <article className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              <div className="flex h-[265px] items-end justify-center bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-right.svg"
                  alt="Tentang kami kanan"
                  width={220}
                  height={311}
                  className="h-auto max-h-[250px] w-auto"
                />
              </div>
              <div className="h-6 bg-[#ffec9a]" />
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  Kami menghadirkan solusi inovatif dalam pengelolaan stok agar
                  setiap produk tetap memiliki nilai jual dan peluang keuntungan
                  baru bagi pelaku usaha.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 2) Solusi */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-8 lg:px-12 lg:py-14">
        <h2 className="mb-8 text-center text-4xl font-black leading-tight text-black md:text-5xl">
          Kami Menyediakan Solusi
          <br />
          Bisnis yang Efisien
        </h2>
        <div className="overflow-hidden rounded-3xl shadow-sm">
          <Image
            unoptimized
            src="/assets/images/about-us/people-meeting.svg"
            alt="Kami menyediakan solusi bisnis"
            width={1240}
            height={479}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* 3) Dukung pelaku usaha */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-3xl font-semibold leading-tight text-black md:text-4xl">
              Kami hadir untuk mendukung pelaku usaha, reseller, dan UMKM
            </h3>
            <p className="mb-4 text-lg leading-relaxed text-[#3e3e3e]">
              Melalui Bulky.id, pelaku usaha dapat mendapatkan stok grosir
              berkualitas dengan harga lebih hemat, sekaligus memiliki
              kesempatan memulai bisnis tanpa modal besar.
            </p>
            <p className="text-lg leading-relaxed text-[#3e3e3e]">
              Kami juga membantu mitra meningkatkan keuntungan melalui sistem
              distribusi yang transparan, efisien, dan terpercaya.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <Image
              unoptimized
              src="/assets/images/about-us/people-in-warehouse.svg"
              alt="Dukung pelaku usaha"
              width={564}
              height={443}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4) Ekosistem */}
      <section className="relative mt-4 w-full overflow-hidden bg-[#ffcf02] py-12 lg:py-16">
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#ffec9a]" />
        <div className="relative mx-auto grid w-full max-w-[1280px] gap-8 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <Image
              unoptimized
              src="/assets/images/about-us/warehouse-vibe.svg"
              alt="Ekosistem Bulky"
              width={564}
              height={471}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <h3 className="mb-4 text-4xl font-bold text-black">
              Ekosistem Bulky.id
            </h3>
            <p className="mb-4 text-xl leading-relaxed text-[#242424]">
              Kami bekerja sama dengan ritel besar, distributor, dan mitra
              logistik di seluruh Indonesia. Dari proses pengumpulan, sortir,
              hingga distribusi, semuanya kami jalankan dengan sistem digital
              yang cepat dan terpercaya.
            </p>
            <p className="text-xl leading-relaxed text-[#242424]">
              Dari stok berlebih menjadi peluang baru untuk bisnis dan
              keberlanjutan.
            </p>

            <div className="mt-6 flex items-end justify-end gap-2">
              <Image
                unoptimized
                src="/assets/images/about-us/box-package.svg"
                alt="Box package"
                width={392}
                height={285}
                className="h-auto w-44 md:w-52"
              />
              <Image
                unoptimized
                src="/assets/images/about-us/people-left.svg"
                alt="Person"
                width={280}
                height={309}
                className="h-auto w-28 md:w-32"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5) Berita */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8 lg:px-12">
        <h3 className="mb-6 text-4xl font-bold text-black">Berita Bulky</h3>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <article>
            <div className="overflow-hidden rounded-3xl">
              <Image
                unoptimized
                src="/assets/images/about-us/people-meeting.svg"
                alt="Berita utama"
                width={1240}
                height={479}
                className="h-auto w-full object-cover"
              />
            </div>
            <h4 className="mt-4 text-3xl font-semibold leading-tight text-black">
              Ribuan Pelaku Usaha Manfaatkan Bulky.id untuk Dapatkan Stok Murah
            </h4>
            <p className="mt-3 text-sm text-[#8a8a8a]">12 Agustus 2025</p>
          </article>

          <div className="space-y-4">
            {newsList.map((item, idx) => (
              <article
                key={idx}
                className="grid grid-cols-[140px_1fr] gap-3 rounded-2xl"
              >
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    unoptimized
                    src={item.image}
                    alt={item.title}
                    width={280}
                    height={200}
                    className="h-[95px] w-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="line-clamp-1 text-base font-semibold text-black">
                    {item.title}
                  </h5>
                  <p className="line-clamp-2 text-sm text-[#5f5f5f]">
                    {item.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-[#9a9a9a]">{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 border-b border-[#d9d9d9]" />
      </section>

      {/* 6) Di Bulky */}
      <section className="relative mx-auto w-full max-w-[1280px] bg-[#f2f2f2] px-4 py-14 md:px-8 lg:px-12">
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-top.svg"
          alt="Bulky watermark"
          width={780}
          height={260}
          className="pointer-events-none absolute left-1/2 top-4 hidden w-[60%] max-w-[780px] -translate-x-1/2 lg:block"
        />
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-bottom.svg"
          alt="Bulky watermark bottom"
          width={1288}
          height={308}
          className="pointer-events-none absolute bottom-0 left-1/2 hidden w-full max-w-[1288px] -translate-x-1/2 lg:block"
        />

        <div className="relative z-10">
          <div className="relative rounded-[18px] bg-[#ffcf02] shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
            <div className="grid items-end gap-3 p-4 md:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:pl-0">
              <div className="relative flex items-end justify-center lg:-mb-14">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-wrapping-box.svg"
                  alt="Di Bulky"
                  width={811}
                  height={583}
                  className="h-auto w-full max-w-[500px]"
                />
              </div>

              <div className="pb-2 lg:pr-4">
                <h3 className="mb-4 text-4xl font-bold leading-tight text-black">
                  Di Bulky.id, setiap kontainer dan palet kami kemas dengan
                  hati-hati
                </h3>
                <p className="mb-5 text-xl leading-relaxed text-[#1f1f1f]">
                  Sebagai platform likuidasi ritel online pertama di Indonesia,
                  <strong> Bulky.id</strong> hadir untuk membantu pelaku usaha
                  mendapatkan stok terbaik, mengubah kelebihan barang menjadi
                  peluang bisnis baru yang menguntungkan dan berkelanjutan.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-2xl text-[#333]">
                    <Image
                      unoptimized
                      src="/assets/images/about-us/icons/checklist-icon.svg"
                      alt="Aman"
                      width={27}
                      height={27}
                      className="h-6 w-6"
                    />
                    <span>Aman</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-2xl text-[#333]">
                    <Image
                      unoptimized
                      src="/assets/images/about-us/icons/truck-fast-icon.svg"
                      alt="Cepat"
                      width={37}
                      height={25}
                      className="h-6 w-auto"
                    />
                    <span>Cepat</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-2xl text-[#333]">
                    <Image
                      unoptimized
                      src="/assets/images/about-us/icons/headphone-support-icon.svg"
                      alt="24/7 Dukungan"
                      width={25}
                      height={28}
                      className="h-6 w-auto"
                    />
                    <span>24/7 Dukungan</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-8 rounded-b-[18px] bg-[#ffec9a]" />
          </div>
        </div>
      </section>

      {/* 7) CTA Home (max width diseragamkan) */}
      <section className="mx-auto w-full max-w-[1280px]">
        <InfoSection />
      </section>
    </main>
  );
};

export default AboutPage;
