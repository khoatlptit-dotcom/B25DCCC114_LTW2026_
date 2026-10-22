import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, onChangeName }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(playerName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    onChangeName(name.trim()); // lifting state up lên App
    navigate('/play');
  };

  return (
    <div className="home">
      <h1>Ai là triệu phú</h1>
      <ul className="rules">
        <li>15 câu hỏi trắc nghiệm về HTML, CSS, ES6, React; mỗi câu 30 giây.</li>
        <li>Trả lời đúng thì leo lên bậc tiền thưởng tiếp theo, câu 15 trị giá 250.000.000 đ.</li>
        <li>Câu 5, 10, 15 là mốc an toàn: trả lời sai/hết giờ vẫn giữ tiền mốc đã qua.</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Tên người chơi"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={name.trim() === ''}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
