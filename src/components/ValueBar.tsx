const VALUE_ITEMS = [
  { icon: 'fas fa-globe', text: 'Thương hiệu toàn cầu' },
  { icon: 'fas fa-heart', text: 'Tài chính nhân văn' },
  { icon: 'fas fa-star', text: 'Giá trị & Trải nghiệm' },
  { icon: 'fas fa-shield-alt', text: 'An toàn & Bảo mật' },
  { icon: 'fas fa-headset', text: 'Hỗ trợ 24/7: 0969 930 328' },
]

export default function ValueBar() {
  return (
    <div className="value-bar">
      <div className="container">
        <div className="value-items">
          {VALUE_ITEMS.map((v, i) => (
            <div key={i} className="value-item">
              <div className="value-icon"><i className={v.icon}></i></div>
              <span>{v.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
