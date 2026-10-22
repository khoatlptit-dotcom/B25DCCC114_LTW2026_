import { PRIZES, MILESTONES, formatMoney } from '../data';

// CSS dùng flex-direction: column-reverse nên câu 15 nằm trên cùng
const MoneyLadder = ({ currentIndex }) => (
  <ul className="ladder">
    {PRIZES.map((prize, i) => {
      const isActive = i === currentIndex;
      const isMilestone = MILESTONES.includes(i + 1);
      return (
        <li
          key={i}
          className={`${isActive ? 'active' : ''} ${isMilestone ? 'milestone' : ''}`}
        >
          <span>{i + 1}</span>
          <span>{formatMoney(prize)}</span>
        </li>
      );
    })}
  </ul>
);

export default MoneyLadder;
