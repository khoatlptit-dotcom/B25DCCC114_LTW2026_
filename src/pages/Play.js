import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const PlayGame = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering → locked → revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const current = questions[index];
  const total = questions.length;

  // Kết thúc lượt chơi: chuyển sang /result (replace) kèm state
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const goNext = () => {
    setIndex((i) => i + 1);
    setStatus('answering');
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ 30 giây: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // Hết giờ = trả lời sai (selected = null)
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      setSelected(null);
      setStatus('locked');
    }
  }, [timeLeft, status]);

  // Các bước: locked --1s--> revealed --2s--> câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const id = setTimeout(() => {
        if (selected === current.answer) {
          if (index === total - 1) {
            finish('win', total);
          } else {
            goNext();
          }
        } else {
          finish(selected === null ? 'timeout' : 'wrong', index);
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={total}
          question={current.question}
          options={current.options}
          answer={current.answer}
          selected={selected}
          status={status}
          hidden={[]}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder currentIndex={index} />
    </div>
  );
};

const Play = ({ questions, loading, error, playerName }) => {
  // Chặn vào thẳng /play khi chưa nhập tên
  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error || questions.length === 0) {
    return <p className="error">{error || 'Không có câu hỏi'}</p>;
  }
  return <PlayGame questions={questions} playerName={playerName} />;
};

export default Play;
