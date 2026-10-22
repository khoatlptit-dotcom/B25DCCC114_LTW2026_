import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào.</p>
      </div>
    );
  }

  // sort trên bản sao của mảng, không làm đổi state gốc
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const maxPrize = history.reduce((max, r) => Math.max(max, r.prize), 0);
  const totalPrize = history.reduce((sum, r) => sum + r.prize, 0);

  return (
    <div>
      <h2>Lịch sử</h2>
      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Tiền thưởng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.correctCount}</td>
              <td>{formatMoney(r.prize)}</td>
              <td>{r.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Tiền thưởng cao nhất: ${formatMoney(maxPrize)}`}</p>
      <p>{`Tổng tiền thưởng: ${formatMoney(totalPrize)}`}</p>
      <button type="button" onClick={onClear}>
        Xóa lịch sử
      </button>
    </div>
  );
};

export default History;
