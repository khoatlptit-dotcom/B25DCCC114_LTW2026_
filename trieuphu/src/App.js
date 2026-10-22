import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import { STORAGE_KEY, loadHistory } from './utils';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(loadHistory);

  // Mounting: gọi API lấy câu hỏi, cleanup bằng controller.abort()
  useEffect(() => {
    const controller = new AbortController();
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        if (!Array.isArray(res.data)) {
          throw new Error('Dữ liệu không hợp lệ');
        }
        setQuestions(res.data);
        setError('');
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // request bị hủy → bỏ qua
        setError('Không tải được câu hỏi');
        setLoading(false);
      }
    };
    fetchQuestions();
    return () => controller.abort();
  }, []);

  // Updating: lưu lịch sử vào localStorage mỗi khi history đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      // bỏ qua lỗi lưu trữ
    }
  }, [history]);

  const addRecord = (record) => setHistory((prev) => [record, ...prev]);
  const clearHistory = () => setHistory([]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              onChangeName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              loading={loading}
              error={error}
              playerName={playerName}
              onFinish={addRecord}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} onClear={clearHistory} />}
        />
        <Route
          path="questions"
          element={
            <QuestionBank questions={questions} loading={loading} error={error} />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail questions={questions} loading={loading} error={error} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
