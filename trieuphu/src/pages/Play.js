import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, splitAudience } from '../utils';

const DEFAULT_TITLE = 'Ai là triệu phú';

const PlayGame = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering → locked → revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false, stop: false });

  const current = questions[index];
  const total = questions.length;

  // Kết thúc lượt chơi: lưu lịch sử rồi chuyển sang /result (replace)
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({
      id: Date.now(),
      name: playerName,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
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
    setHidden([]);
    setAudience(null);
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  // ---- Quyền trợ giúp ----
  const handleFifty = () => {
    const wrongs = [0, 1, 2, 3].filter((i) => i !== current.answer);
    const shuffled = [...wrongs].sort(() => Math.random() - 0.5);
    setHidden(shuffled.slice(0, 2));
    setUsed((u) => ({ ...u, fifty: true }));
  };

  const handleAudience = () => {
    setAudience(splitAudience(current.answer, hidden));
    setUsed((u) => ({ ...u, audience: true }));
  };

  const handleStop = () => {
    setUsed((u) => ({ ...u, stop: true }));
    finish('quit', index); // index = số câu đã trả lời đúng
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

  // Phím tắt A–D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1 || status !== 'answering' || hidden.includes(i)) return;
      setSelected(i);
      setStatus('locked');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} - ${playerName}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [index, total, playerName]);

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
          hidden={hidden}
          onSelect={handleSelect}
        />
        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onStop={handleStop}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder currentIndex={index} />
    </div>
  );
};

const Play = ({ questions, loading, error, playerName, onFinish }) => {
  // Chặn vào thẳng /play khi chưa nhập tên
  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error || questions.length === 0) {
    return <p className="error">{error || 'Không có câu hỏi'}</p>;
  }
  return (
    <PlayGame questions={questions} playerName={playerName} onFinish={onFinish} />
  );
};

export default Play;
