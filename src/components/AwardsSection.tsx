// Hình ảnh giải thưởng thật từ Shinhan Finance (đã tải về /public/images/awards/)
const AWARDS = [
  { img: '/images/awards/award-1.png', name: 'HR Award 2020' },
  { img: '/images/awards/award-2.png', name: 'AREA 2021' },
  { img: '/images/awards/award-3.jpg', name: 'Certificate of Achievement' },
  { img: '/images/awards/award-4.png', name: 'Cup 2020 - Shinhan Finance' },
  { img: '/images/awards/award-5.png', name: 'Đơn vị tiêu biểu - CIC 2022' },
  { img: '/images/awards/award-6.png', name: 'Giải thưởng thiết kế xuất sắc' },
  { img: '/images/awards/award-7.png', name: 'Giải thưởng uy tín 2023' },
  { img: '/images/awards/award-8.png', name: 'Giải thưởng xuất sắc 2024' },
]

export default function AwardsSection() {
  // Duplicate để tạo hiệu ứng loop vô hạn
  const all = [...AWARDS, ...AWARDS]

  return (
    <section className="awards-section" id="awards">
      <div className="container">
        <h2 className="section-title blue">Giải thưởng &amp; Bằng khen</h2>
      </div>
      <div className="awards-carousel">
        <div className="awards-track">
          {all.map((a, i) => (
            <div key={i} className="award-item">
              <div className="award-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt={a.name} loading="lazy" />
              </div>
              <p>{a.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
