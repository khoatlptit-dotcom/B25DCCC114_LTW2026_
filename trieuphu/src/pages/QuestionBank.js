import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions, loading, error }) => {
  const [level, setLevel] = useState('all');
  const [keyword, setKeyword] = useState('');

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="error">{error}</p>;

  const kw = keyword.trim().toLowerCase();
  const filtered = questions.filter(
    (q) =>
      (level === 'all' || q.level === Number(level)) &&
      q.question.toLowerCase().includes(kw)
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <label>
          Mức độ:{' '}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="1">{LEVELS[1]}</option>
            <option value="2">{LEVELS[2]}</option>
            <option value="3">{LEVELS[3]}</option>
          </select>
        </label>
        <label>
          Tìm kiếm:{' '}
          <input
            type="text"
            value={keyword}
            placeholder="Nhập nội dung câu hỏi..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{`Có ${filtered.length} câu hỏi`}</p>
    </div>
  );
};

export default QuestionBank;
