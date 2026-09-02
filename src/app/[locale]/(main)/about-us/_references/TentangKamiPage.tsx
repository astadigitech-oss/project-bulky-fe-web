"use client";

import Link from "next/link";

// ============================================================================
// ASSET URLs (Figma MCP — ganti dengan /public setelah download, berlaku 7 hari)
// ============================================================================

// Hero cards
const IMG_BULKY_LOGO_BG1  = "https://www.figma.com/api/mcp/asset/7b1a41c7-45dd-41a2-b7c1-509c5bdbb775"; // watermark besar atas
const IMG_BULKY_LOGO_BG2  = "https://www.figma.com/api/mcp/asset/93d6a09c-126c-4b62-abaa-21b2f7c9a1c4"; // watermark besar bawah
const IMG_CARD1_PERSON    = "https://www.figma.com/api/mcp/asset/fd26291d-393c-4282-b86e-ce15109df2d0"; // girl2 – card kiri
const IMG_CARD2_PERSON    = "https://www.figma.com/api/mcp/asset/7cb500ac-5f6f-4d72-a1ef-7d5ccddc4ad0"; // adobe express – card tengah
const IMG_CARD3_PERSON    = "https://www.figma.com/api/mcp/asset/dd0f385d-d21f-48bf-b893-ea415f388ea7"; // boy4 – card kanan

// Section images
const IMG_SOLUSI_BANNER   = "https://www.figma.com/api/mcp/asset/329233b8-892b-4cc1-9457-1409c561607a"; // Frame 1325 1
const IMG_DUKUNG_PHOTO    = "https://www.figma.com/api/mcp/asset/c85657fe-d5be-41d3-aa12-df27c6ec2251"; // Frame 1325 2
const IMG_EKOSISTEM_PHOTO = "https://www.figma.com/api/mcp/asset/a2f1c38f-b075-49ac-9ee1-8851176eb791"; // Frame 1325 3
const IMG_GIRL3           = "https://www.figma.com/api/mcp/asset/fd26291d-393c-4282-b86e-ce15109df2d0"; // girl 3
const IMG_BOX4            = "https://www.figma.com/api/mcp/asset/4aa1a996-d5e6-4d1d-9a69-426a5065eaf7"; // box 4
const IMG_LOOPER1         = "https://www.figma.com/api/mcp/asset/a18b96e5-83f9-408e-83bf-b5788b66483a";
const IMG_LOOPER2         = "https://www.figma.com/api/mcp/asset/95f53f58-f2f4-41f0-812f-7efe9c20ff8e";

// Berita / News
const IMG_NEWS_FEATURED   = "https://www.figma.com/api/mcp/asset/9647afee-a661-4725-98b5-3846c530fb9a";
const IMG_NEWS_1          = "https://www.figma.com/api/mcp/asset/7b1a41c7-45dd-41a2-b7c1-509c5bdbb775";
const IMG_NEWS_2          = "https://www.figma.com/api/mcp/asset/93d6a09c-126c-4b62-abaa-21b2f7c9a1c4";
const IMG_NEWS_3          = "https://www.figma.com/api/mcp/asset/cf2aca60-010c-403f-93f5-e2d5b573fa08";
const IMG_NEWS_4          = "https://www.figma.com/api/mcp/asset/de3092d1-aeae-4c8f-b4c8-8e4b340be958";

// Di Bulky.id section
const IMG_DIBULKY_PHOTO   = "https://www.figma.com/api/mcp/asset/530da078-4dd3-450a-acff-8637e60e910c";

// CTA section
const IMG_GIRL_CTA        = "https://www.figma.com/api/mcp/asset/5ab96c7a-de9d-4a6a-8e71-7baa5fd9270c";
const IMG_BOY_CTA         = "https://www.figma.com/api/mcp/asset/dd0f385d-d21f-48bf-b893-ea415f388ea7";
const IMG_AVATAR1         = "https://www.figma.com/api/mcp/asset/977ce5ec-6d37-45e5-a2d1-913ec3b204fb";
const IMG_AVATAR2         = "https://www.figma.com/api/mcp/asset/1c543b64-daa6-46ee-9e35-dfe038f3162a";
const IMG_AVATAR3         = "https://www.figma.com/api/mcp/asset/c992e749-4b63-4ad5-8978-f5b353e7bdaa";
const IMG_AVATAR4         = "https://www.figma.com/api/mcp/asset/9b9a956e-0676-48d8-9878-9f6cdafd1cc5";
const IMG_STAR            = "https://www.figma.com/api/mcp/asset/aa9e7f60-2d4c-4d8f-9b38-8c3f5a983454";
const IMG_ICON_SHIP       = "https://www.figma.com/api/mcp/asset/a90ea022-8712-4095-928b-a456f9508192";
const IMG_ICON_PAYMENT    = "https://www.figma.com/api/mcp/asset/0f2a872d-9916-4acb-a023-893461aec658";
const IMG_ICON_SUPPORT    = "https://www.figma.com/api/mcp/asset/2e679413-e1d0-45fe-a7c3-e83ad7bb7498";

// Footer
const IMG_FOOTER_LOGO     = "https://www.figma.com/api/mcp/asset/6eb4471c-3a01-4d6a-bb83-201b9a18707e";
const IMG_SOCIAL_IG       = "https://www.figma.com/api/mcp/asset/12c6a732-1bd8-4327-b057-56f35160c198";
const IMG_SOCIAL_TW       = "https://www.figma.com/api/mcp/asset/84c85f1b-4a3f-452c-b84f-7b9e6b460c51";
const IMG_SOCIAL_FB       = "https://www.figma.com/api/mcp/asset/e40049b2-9e04-409c-9dd8-e0a0ee4b4d83";
const IMG_APPLE_STORE     = "https://www.figma.com/api/mcp/asset/9accda48-ac08-48d4-91c8-d2de4c95ae8e";
const IMG_PLAY_STORE      = "https://www.figma.com/api/mcp/asset/5e953b6c-c6c3-4c51-bf11-5157d4129d1e";

// Payment logos
const IMG_PAY_GOOGLEPAY   = "https://www.figma.com/api/mcp/asset/1d41109d-a1a5-410c-a070-d627786236fa";
const IMG_PAY_SAMSUNG     = "https://www.figma.com/api/mcp/asset/a261729b-99ea-4b0d-919d-a2218d1a0ffd";
const IMG_PAY_MAESTRO     = "https://www.figma.com/api/mcp/asset/9c2c62cd-4655-44b6-a2a2-d96336ff31b1";
const IMG_PAY_APPLEPAY    = "https://www.figma.com/api/mcp/asset/3cc38ed2-87ba-4040-99c9-b16330d2829a";
const IMG_PAY_STRIPE      = "https://www.figma.com/api/mcp/asset/5fe68690-32a4-49da-8efb-924d77a91d6d";
const IMG_PAY_MASTERCARD  = "https://www.figma.com/api/mcp/asset/152ab63a-5d3d-4d6d-9d7d-a92bef85b78b";
const IMG_PAY_VISA        = "https://www.figma.com/api/mcp/asset/212d0553-18c1-417b-822d-32c76a00d7d9";
const IMG_PAY_VISACARD    = "https://www.figma.com/api/mcp/asset/12e13962-6faf-4e20-9b53-e64f79c27310";
const IMG_PAY_WESTERNUN   = "https://www.figma.com/api/mcp/asset/3925ad09-2ed7-4761-a5dc-395d1e48f885";
const IMG_PAY_MONEYGRAM   = "https://www.figma.com/api/mcp/asset/19e66385-1874-4c33-b65a-acf11da50660";
const IMG_PAY_PAYPAL      = "https://www.figma.com/api/mcp/asset/f5f0c20e-0943-44ee-af0c-de6005b89d93";
const IMG_PAY_PAYONEER    = "https://www.figma.com/api/mcp/asset/d8c626b5-07b2-410b-bc6b-68395205c8fe";

// ============================================================================
// DATA
// ============================================================================

const ABOUT_CARDS = [
  {
    img: IMG_CARD1_PERSON,
    alt: "Tim Bulky – Mitra & Reseller",
    text: (
      <>
        Kami berkomitmen menciptakan ekosistem bisnis yang berkelanjutan,
        transparan, dan saling menguntungkan, antara ritel, mitra logistik, dan
        reseller di seluruh Indonesia.
      </>
    ),
  },
  {
    img: IMG_CARD2_PERSON,
    alt: "Tim Bulky – Likuidasi Ritel",
    text: (
      <>
        <strong>Bulky.id</strong> adalah perusahaan likuidasi ritel online
        pertama di Indonesia yang membantu bisnis mengelola kelebihan stok,
        barang retur, dan produk gagal kirim secara efisien.
      </>
    ),
  },
  {
    img: IMG_CARD3_PERSON,
    alt: "Tim Bulky – Solusi Stok",
    text: (
      <>
        Kami menghadirkan solusi inovatif dalam pengelolaan stok agar setiap
        produk tetap memiliki nilai jual dan peluang keuntungan baru bagi pelaku
        usaha.
      </>
    ),
  },
];

const NEWS_SIDEBAR = [
  { img: IMG_NEWS_1, title: "Bulky.id Buka Gudang Baru", excerpt: "Bulky.id resmi membuka gudang baru di kawasan industri Surabaya untuk men...", date: "12 Agustus 2025" },
  { img: IMG_NEWS_2, title: "Bulky.id Buka Gudang Baru", excerpt: "Bulky.id resmi membuka gudang baru di kawasan industri Surabaya untuk men...", date: "12 Agustus 2025" },
  { img: IMG_NEWS_3, title: "Bulky.id Buka Gudang Baru", excerpt: "Bulky.id resmi membuka gudang baru di kawasan industri Surabaya untuk men...", date: "12 Agustus 2025" },
  { img: IMG_NEWS_4, title: "Bulky.id Buka Gudang Baru", excerpt: "Bulky.id resmi membuka gudang baru di kawasan industri Surabaya untuk men...", date: "12 Agustus 2025" },
];

const PAYMENT_LOGOS = [
  { src: IMG_PAY_GOOGLEPAY, alt: "Google Pay" },
  { src: IMG_PAY_SAMSUNG,   alt: "Samsung Pay" },
  { src: IMG_PAY_MAESTRO,   alt: "Maestro" },
  { src: IMG_PAY_APPLEPAY,  alt: "Apple Pay" },
  { src: IMG_PAY_STRIPE,    alt: "Stripe" },
  { src: IMG_PAY_MASTERCARD,alt: "Mastercard" },
  { src: IMG_PAY_VISA,      alt: "Visa" },
  { src: IMG_PAY_VISACARD,  alt: "Visa & Mastercard" },
  { src: IMG_PAY_WESTERNUN, alt: "Western Union" },
  { src: IMG_PAY_MONEYGRAM, alt: "MoneyGram" },
  { src: IMG_PAY_PAYPAL,    alt: "PayPal" },
  { src: IMG_PAY_PAYONEER,  alt: "Payoneer" },
];

const FOOTER_NAV = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Cara Membeli", href: "/cara-membeli" },
  { label: "Tentang Pembayaran", href: "/pembayaran" },
  { label: "Sering Ditanyakan", href: "/faq" },
  { label: "Syarat dan Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
];

const FOOTER_SERVICES = [
  { label: "Produk Lainnya", href: "/produk" },
  { label: "Pesanan & Pengembalian", href: "/pesanan" },
  { label: "Profil Pengguna", href: "/profil" },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Card "Tentang Kami" — foto + strip kuning + teks putih di bawah */
function AboutCard({
  img,
  alt,
  text,
}: {
  img: string;
  alt: string;
  text: React.ReactNode;
}) {
  return (
    <div className="relative w-[334px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex flex-col rounded-[20px] overflow-hidden">
      {/* Foto */}
      { }
      <img
        src={img}
        alt={alt}
        className="w-full h-[310px] object-cover object-top"
      />
      {/* Strip kuning */}
      <div className="bg-[#ffcf02] px-[12px] pt-[8px] pb-0 min-h-[60px]" />
      {/* Strip krem */}
      <div className="bg-[#ffec9a] px-[12px] pb-0 flex-1" />
      {/* Teks overlay di atas strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] px-[12px] py-[16px]">
        <p className="text-[15px] font-light text-black leading-[25px] font-roboto">
          {text}
        </p>
      </div>
    </div>
  );
}

/** Badge fitur di section CTA */
function FeatureBadge({
  icon,
  label,
  sublabel,
}: {
  icon: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="flex-1 bg-white/60 rounded-[20px] px-[20px] py-[16px] flex flex-col gap-[6px]">
      { }
      <img src={icon} alt={label} className="w-[24px] h-[24px] object-contain" />
      <p className="text-[16px] font-normal text-black font-roboto">{label}</p>
      <p className="text-[14px] font-normal text-black font-roboto leading-[20px]">
        {sublabel}
      </p>
    </div>
  );
}

/** Sidebar news item */
function NewsSidebarItem({
  img,
  title,
  excerpt,
  date,
}: {
  img: string;
  title: string;
  excerpt: string;
  date: string;
}) {
  return (
    <div className="flex gap-[16px]">
      { }
      <img
        src={img}
        alt={title}
        className="w-[218px] h-[151px] rounded-[20px] object-cover shrink-0"
      />
      <div className="flex flex-col justify-center gap-[6px]">
        <p className="text-[14px] font-bold text-black font-roboto">{title}</p>
        <p className="text-[14px] font-light text-black font-roboto leading-[25px]">
          {excerpt}
        </p>
        <p className="text-[12px] font-light text-[#727272] font-roboto">{date}</p>
      </div>
    </div>
  );
}

// ============================================================================
// SECTIONS
// ============================================================================

/** SECTION 1 — Hero / 3 About Cards */
function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-[40px]">
      {/* Watermark BULKY besar di background */}
      { }
      <img
        src={IMG_BULKY_LOGO_BG1}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-[43px] w-[780px] h-[260px] object-contain opacity-100"
      />
      { }
      <img
        src={IMG_BULKY_LOGO_BG2}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[1288px] h-[434px] object-contain"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-[68px]">
        <p className="text-center text-[24px] font-light text-black font-roboto mb-[48px]">
          Tentang Kami
        </p>
        <div className="flex justify-center gap-[68px]">
          {ABOUT_CARDS.map((card, i) => (
            <AboutCard key={i} img={card.img} alt={card.alt} text={card.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** SECTION 2 — Solusi Bisnis */
function SolusiSection() {
  return (
    <section className="w-full bg-white py-[60px]">
      <div className="max-w-[1280px] mx-auto px-[68px]">
        <h2 className="text-[52px] font-black text-black text-center leading-[70px] font-roboto mb-[40px]">
          Kami Menyediakan Solusi
          <br />
          Bisnis yang Efisien
        </h2>
        { }
        <img
          src={IMG_SOLUSI_BANNER}
          alt="Solusi Bisnis Bulky"
          className="w-full h-[471px] rounded-[20px] object-cover shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        />
      </div>
    </section>
  );
}

/** SECTION 3 — Dukung Pelaku Usaha (teks kiri, foto kanan) */
function DukungSection() {
  return (
    <section className="w-full bg-white py-[60px]">
      <div className="max-w-[1280px] mx-auto px-[68px] flex items-start gap-[60px]">
        {/* Teks kiri */}
        <div className="flex-1 flex flex-col gap-[24px]">
          <h2 className="text-[32px] font-medium text-black leading-[50px] font-roboto">
            Kami hadir untuk mendukung pelaku usaha,
            <br />
            reseller, dan UMKM
          </h2>
          <p className="text-[24px] font-light text-black leading-[40px] font-roboto">
            Melalui Bulky.id, pelaku usaha dapat mendapatkan stok grosir
            berkualitas dengan harga lebih hemat, sekaligus memiliki kesempatan
            untuk memulai bisnis baru tanpa memerlukan modal besar.
          </p>
          <p className="text-[24px] font-light text-black leading-[40px] font-roboto">
            Kami juga membantu mitra kami untuk meningkatkan keuntungan melalui
            sistem distribusi yang transparan, efisien, dan terpercaya, sehingga
            setiap langkah bisnis menjadi lebih mudah dan bernilai.
          </p>
        </div>
        {/* Foto kanan */}
        { }
        <img
          src={IMG_DUKUNG_PHOTO}
          alt="Pelaku usaha menggunakan Bulky"
          className="w-[556px] h-[435px] rounded-[20px] object-cover shadow-[0px_4px_4px_rgba(0,0,0,0.25)] shrink-0"
        />
      </div>
    </section>
  );
}

/** SECTION 4 — Ekosistem Bulky.id (kuning, foto kiri, teks kanan) */
function EkosistemSection() {
  return (
    <section className="relative w-full bg-[#ffcf02] overflow-hidden py-[68px]">
      {/* Looper pattern */}
      { }
      <img
        src={IMG_LOOPER1}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -left-[161px] -top-[82px] w-[976px] h-auto"
      />
      {/* Strip krem bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-[182px] bg-[#ffec9a]" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-[68px] flex items-start gap-[60px]">
        {/* Foto kiri */}
        <div className="relative shrink-0">
          { }
          <img
            src={IMG_EKOSISTEM_PHOTO}
            alt="Ekosistem Bulky"
            className="w-[556px] h-[463px] rounded-[20px] object-cover shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Teks kanan */}
        <div className="flex-1 flex flex-col gap-[24px] pt-[8px]">
          <h2 className="text-[32px] font-medium text-black leading-[50px] font-roboto">
            Ekosistem Bulky.id
          </h2>
          <p className="text-[24px] font-light text-black leading-[40px] font-roboto">
            Kami bekerja sama dengan ritel besar, distributor, dan mitra
            logistik di seluruh Indonesia. Dari proses pengumpulan, sortir,
            hingga distribusi, semuanya kami jalankan dengan sistem digital yang
            cepat dan terpercaya.
          </p>
          <p className="text-[24px] font-light text-black leading-[40px] font-roboto">
            Dari stok berlebih menjadi peluang baru untuk bisnis dan
            keberlanjutan.
          </p>

          {/* Girl + box ilustrasi di pojok kanan bawah */}
          <div className="relative self-end flex items-end">
            { }
            <img
              src={IMG_BOX4}
              alt=""
              aria-hidden
              className="absolute right-[60px] bottom-0 w-[200px] h-[200px] object-contain"
            />
            { }
            <img
              src={IMG_GIRL3}
              alt="Ilustrasi Bulky"
              className="relative z-10 w-[160px] h-[230px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** SECTION 5 — Berita Bulky */
function BeritaSection() {
  return (
    <section className="w-full bg-white py-[60px]">
      <div className="max-w-[1280px] mx-auto px-[68px]">
        <h2 className="text-[32px] font-medium text-black leading-[50px] font-roboto mb-[32px]">
          Berita Bulky
        </h2>
        <div className="flex gap-[40px]">
          {/* Featured artikel besar */}
          <Link href="/berita/featured" className="block shrink-0 group">
            { }
            <img
              src={IMG_NEWS_FEATURED}
              alt="Ribuan Pelaku Usaha Manfaatkan Bulky.id"
              className="w-[700px] h-[495px] rounded-[20px] object-cover group-hover:opacity-95 transition-opacity"
            />
            <div className="mt-[16px]">
              <h3 className="text-[32px] font-medium text-black leading-[50px] font-roboto">
                Ribuan Pelaku Usaha Manfaatkan Bulky.id
                <br />
                untuk Dapatkan Stok Murah
              </h3>
              <p className="text-[16px] font-light text-[#727272] font-roboto mt-[4px]">
                12 Agustus 2025
              </p>
            </div>
          </Link>

          {/* Sidebar 4 artikel kecil */}
          <div className="flex flex-col gap-[24px] flex-1">
            {NEWS_SIDEBAR.map((item, i) => (
              <Link key={i} href="/berita" className="block group">
                <NewsSidebarItem
                  img={item.img}
                  title={item.title}
                  excerpt={item.excerpt}
                  date={item.date}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Garis pemisah */}
        <div className="mt-[48px] border-t border-[#d9d9d9]" />
      </div>
    </section>
  );
}

/** SECTION 6 — "Di Bulky.id, setiap kontainer..." */
function DiBulkySection() {
  return (
    <section className="w-full bg-white py-[60px]">
      <div className="max-w-[1280px] mx-auto px-[68px]">
        {/* Watermark BULKY besar */}
        { }
        <img
          src={IMG_BULKY_LOGO_BG1}
          alt=""
          aria-hidden
          className="pointer-events-none select-none mx-auto mb-[-100px] w-[780px] h-[260px] object-contain"
        />

        <div className="relative flex items-start gap-[60px]">
          {/* Ilustrasi kontainer (mirror) */}
          { }
          <img
            src={IMG_DIBULKY_PHOTO}
            alt="Kontainer Bulky"
            className="w-[500px] h-[583px] object-cover shrink-0 scale-x-[-1]"
          />

          {/* Konten kanan */}
          <div className="flex-1 flex flex-col gap-[24px]">
            <p className="text-[24px] font-light text-black leading-[40px] font-roboto">
              Sebagai platform likuidasi ritel online pertama di Indonesia,{" "}
              <strong className="font-medium">Bulky.id</strong> hadir untuk
              membantu pelaku usaha mendapatkan stok terbaik, mengubah kelebihan
              barang menjadi peluang bisnis baru yang menguntungkan dan
              berkelanjutan.
            </p>
            <h2 className="text-[32px] font-medium text-black leading-[50px] font-roboto">
              Di Bulky.id, setiap kontainer dan palet kami
              <br />
              kemas dengan hati-hati
            </h2>

            {/* Card kuning + badge fitur */}
            <div className="bg-[#ffcf02] rounded-[20px] p-[24px]">
              <div className="bg-[#ffec9a] rounded-b-[20px] -mx-[24px] -mb-[24px] px-[24px] pb-[24px] pt-[16px]">
                <div className="flex gap-[12px]">
                  {/* Aman */}
                  <div className="flex-1 bg-white rounded-[20px] flex flex-col items-center gap-[8px] py-[16px] px-[12px]">
                    { }
                    <img src={IMG_ICON_PAYMENT} alt="Aman" className="w-[24px] h-[24px]" />
                    <span className="text-[24px] font-light text-black font-roboto">Aman</span>
                  </div>
                  {/* Cepat */}
                  <div className="flex-1 bg-white rounded-[20px] flex flex-col items-center gap-[8px] py-[16px] px-[12px]">
                    { }
                    <img src={IMG_ICON_SHIP} alt="Cepat" className="w-[24px] h-[24px]" />
                    <span className="text-[24px] font-light text-black font-roboto">Cepat</span>
                  </div>
                  {/* 24/7 */}
                  <div className="flex-1 bg-white rounded-[20px] flex flex-col items-center gap-[8px] py-[16px] px-[12px]">
                    { }
                    <img src={IMG_ICON_SUPPORT} alt="Dukungan 24/7" className="w-[24px] h-[24px]" />
                    <span className="text-[24px] font-light text-black font-roboto">24/7 Dukungan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** SECTION 7 — CTA "Kirim Keseluruh Indonesia" */
function CTASection() {
  return (
    <section className="relative w-full bg-[#ffcf02] overflow-hidden py-[55px] min-h-[436px]">
      {/* Looper pattern kiri */}
      { }
      <img
        src={IMG_LOOPER2}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -left-[217px] -top-[427px] w-[1147px] h-auto"
      />

      {/* Ilustrasi orang kanan */}
      { }
      <img
        src={IMG_GIRL_CTA}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute right-[219px] -top-[57px] h-[750px] w-auto object-contain"
      />
      { }
      <img
        src={IMG_BOY_CTA}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-[9px] h-[639px] w-auto object-contain"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-[68px]">
        <h2 className="text-[52px] font-black text-black leading-[80px] font-roboto mb-[8px]">
          Kirim Keseluruh Indonesia
        </h2>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => { /* TODO: navigasi ke halaman produk */ }}
          className="bg-black text-white text-[24px] font-bold font-roboto px-[90px] py-[17px] rounded-[50px] mb-[32px] hover:bg-gray-900 transition-colors"
        >
          DAPATKAN SEKARANG
        </button>

        {/* 3 Feature badges */}
        <div className="flex gap-[20px] max-w-[860px] mb-[24px]">
          <FeatureBadge
            icon={IMG_ICON_SHIP}
            label="Pengiriman Kargo"
            sublabel={"Ambil Sendiri atau\nLayanan Pengiriman"}
          />
          <FeatureBadge
            icon={IMG_ICON_PAYMENT}
            label="Pembayaran Terjamin"
            sublabel={"100% Pembayaran\nAman"}
          />
          <FeatureBadge
            icon={IMG_ICON_SUPPORT}
            label="Dukungan 24 Jam"
            sublabel={"Dukungan Khusus"}
          />
        </div>

        {/* Rating + avatar */}
        <div className="flex items-center gap-[8px]">
          {/* Overlapping avatars */}
          <div className="flex -space-x-[8px]">
            {[IMG_AVATAR1, IMG_AVATAR2, IMG_AVATAR3, IMG_AVATAR4].map(
              (src, i) => (
                 
                <img
                  key={i}
                  src={src}
                  alt="Pelanggan"
                  className="w-[34px] h-[34px] rounded-full border-2 border-white object-cover"
                />
              )
            )}
          </div>
          {/* Stars */}
          <div className="flex gap-[3px]">
            {[...Array(5)].map((_, i) => (
               
              <img key={i} src={IMG_STAR} alt="★" className="w-[24px] h-[24px]" />
            ))}
          </div>
          <span className="text-[24px] font-bold text-black font-roboto">5K&nbsp;</span>
          <span className="text-[20px] font-normal text-black font-roboto">Pelanggan Puas</span>
        </div>
      </div>
    </section>
  );
}

/** FOOTER */
function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#d9d9d9] py-[48px]">
      <div className="max-w-[1280px] mx-auto px-[68px]">
        <div className="flex gap-[40px]">
          {/* Kolom 1 — Logo + sosial */}
          <div className="w-[250px] shrink-0 flex flex-col gap-[24px]">
            { }
            <img src={IMG_FOOTER_LOGO} alt="Bulky" className="h-[45px] w-auto object-contain self-start" />
            <p className="text-[16px] font-normal text-black font-roboto leading-[28px]">
              Platform Recommerce Antar
              <br />
              Bisnis Pertama di Indonesia
            </p>
            {/* Social icons */}
            <div className="flex gap-[6px]">
              {[
                { src: IMG_SOCIAL_IG, alt: "Instagram" },
                { src: IMG_SOCIAL_TW, alt: "Twitter / X" },
                { src: IMG_SOCIAL_FB, alt: "Facebook" },
              ].map((s, i) => (
                 
                <img key={i} src={s.src} alt={s.alt} className="w-[33px] h-[33px] object-contain cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </div>
          </div>

          {/* Kolom 2 — Hubungi Kami */}
          <div className="w-[280px] shrink-0 flex flex-col gap-[16px]">
            <p className="text-[16px] font-bold text-black font-roboto">Hubungi Kami</p>
            <div className="text-[16px] font-normal text-black font-roboto leading-[28px]">
              <p>Sahid Sudirman Center 40th Floor</p>
              <p>Jl. Jend. Sudirman No.86, Kota</p>
              <p>Administrasi Jakarta Pusat - 10220</p>
              <p>Indonesia (ID)</p>
            </div>
            <p className="text-[16px] font-medium text-black">0811-833-164</p>
            <p className="text-[16px] font-medium text-black">admin@bulky.id</p>
          </div>

          {/* Kolom 3 — Navigasi */}
          <div className="flex flex-col gap-[8px]">
            <p className="text-[16px] font-bold text-black font-roboto mb-[8px]">Hubungi Kami</p>
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[16px] font-normal text-black font-roboto leading-[28px] hover:text-[#f90] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Kolom 4 — Layanan */}
          <div className="flex flex-col gap-[8px]">
            <p className="text-[16px] font-bold text-black font-roboto mb-[8px]">Layanan</p>
            {FOOTER_SERVICES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[16px] font-normal text-black font-roboto leading-[28px] hover:text-[#f90] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Kolom 5 — Metode Pembayaran + App */}
          <div className="flex-1 flex flex-col gap-[16px]">
            <p className="text-[16px] font-bold text-black font-roboto">Metode Pembayaran</p>
            <div className="grid grid-cols-3 gap-[8px]">
              {PAYMENT_LOGOS.map((pay) => (
                 
                <img
                  key={pay.alt}
                  src={pay.src}
                  alt={pay.alt}
                  className="h-[22px] object-contain"
                />
              ))}
            </div>

            <p className="text-[16px] font-bold text-black font-roboto mt-[8px]">Dapatkan Melalui</p>
            <div className="flex gap-[12px]">
              {/* App Store */}
              <div className="flex items-center gap-[8px] border border-black rounded-[6px] px-[10px] py-[6px] cursor-pointer hover:bg-gray-50 transition-colors">
                { }
                <img src={IMG_APPLE_STORE} alt="Apple" className="w-[20px] h-[24px] object-contain" />
                <div>
                  <p className="text-[9px] leading-none font-roboto">Download on the</p>
                  <p className="text-[16px] font-medium leading-none font-roboto">App Store</p>
                </div>
              </div>
              {/* Play Store */}
              <div className="flex items-center gap-[8px] border border-black rounded-[6px] px-[10px] py-[6px] cursor-pointer hover:bg-gray-50 transition-colors">
                { }
                <img src={IMG_PLAY_STORE} alt="Play" className="w-[21px] h-[24px] object-contain" />
                <div>
                  <p className="text-[9px] leading-none uppercase font-roboto">Get It On</p>
                  <p className="text-[16px] font-medium leading-none font-roboto">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Garis + Copyright */}
        <div className="mt-[32px] border-t border-[#d9d9d9] pt-[16px] flex items-center gap-[4px]">
          { }
          <img src={IMG_ICON_PAYMENT} alt="" className="w-[15px] h-[15px]" />
          <p className="text-[16px] font-medium text-black/80">
            Copyright 2025 bulky.id All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function TentangKamiPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <SolusiSection />
      <DukungSection />
      <EkosistemSection />
      <BeritaSection />
      <DiBulkySection />
      <CTASection />
      <Footer />
    </main>
  );
}
