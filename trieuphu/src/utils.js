import { PRIZES, MILESTONES } from './data';

export const STORAGE_KEY = 'ltw_trieuphu_history';

// reason: 'win' | 'wrong' | 'timeout' | 'quit'
export const calcPrize = (correctCount, reason) => {
  if (correctCount <= 0) return 0;
  if (reason === 'win' || reason === 'quit') {
    return PRIZES[correctCount - 1];
  }
  // wrong / timeout: chỉ nhận tiền của mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[passed[passed.length - 1] - 1];
};

// Chia % cho khán giả: đáp án đúng 40–70%, phần còn lại chia ngẫu nhiên
// cho các đáp án chưa bị 50:50 ẩn; đáp án bị ẩn = 0%. Tổng luôn = 100.
export const splitAudience = (correctIndex, hiddenIndexes) => {
  const result = [0, 0, 0, 0];
  const others = [0, 1, 2, 3].filter(
    (i) => i !== correctIndex && !hiddenIndexes.includes(i)
  );
  if (others.length === 0) {
    result[correctIndex] = 100;
    return result;
  }
  const correctPct = 40 + Math.floor(Math.random() * 31); // 40..70
  result[correctIndex] = correctPct;
  let remaining = 100 - correctPct;
  others.forEach((i, idx) => {
    if (idx === others.length - 1) {
      result[i] = remaining;
    } else {
      const share = Math.floor(Math.random() * (remaining + 1));
      result[i] = share;
      remaining -= share;
    }
  });
  return result;
};

// Bản ghi có tiền thưởng cao nhất (null nếu chưa có lượt nào)
export const getBestRecord = (history) =>
  history.reduce((best, r) => (best === null || r.prize > best.prize ? r : best), null);

export const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
};
