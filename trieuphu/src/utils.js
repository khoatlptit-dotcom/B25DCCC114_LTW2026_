import { PRIZES, MILESTONES } from './data';

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
