// Logo đối tác thật từ Shinhan Finance (đã tải về /public/images/partners/)
const PARTNERS = [
  { img: '/images/partners/nguyen-kim.png',      name: 'Nguyễn Kim' },
  { img: '/images/partners/cho-lon.png',          name: 'Siêu thị Chợ Lớn' },
  { img: '/images/partners/cellphones.png',       name: 'CellphoneS' },
  { img: '/images/partners/di-dong-viet.png',     name: 'Di Động Việt' },
  { img: '/images/partners/hoang-ha-mobile.png',  name: 'Hoàng Hà Mobile' },
  { img: '/images/partners/napas.png',            name: 'NAPAS' },
]

export default function PartnersSection() {
  return (
    <section className="partners-section" id="partners">
      <div className="container">
        {/* Màu xanh #007BC3 như bản gốc */}
        <h2 className="section-title blue">Đối tác</h2>
        <div className="partners-logos">
          {PARTNERS.map((p, i) => (
            <div key={i} className="partner-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.name}
                className="partner-logo-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
