import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatMoney } from '../data';

const REASON_TEXT = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();

  // Mở /result trực tiếp (không có state) → về trang chủ
  if (!state) return <Navigate to="/" replace />;

  const { name, prize, correctCount, reason } = state;

  return (
    <div className="result">
      <h2>{REASON_TEXT[reason]}</h2>
      <p>{`Người chơi: ${name}`}</p>
      <p>{`Số câu trả lời đúng: ${correctCount}`}</p>
      <p>{`Tiền thưởng: ${formatMoney(prize)}`}</p>
      <div className="result-actions">
        <Link className="btn" to="/play">Chơi lại</Link>
        <Link className="btn" to="/">Về trang chủ</Link>
      </div>
    </div>
  );
};

export default Result;
