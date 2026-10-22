const Timer = ({ timeLeft }) => (
  <div className={`timer ${timeLeft <= 10 ? 'danger' : ''}`}>
    {`Còn ${Math.max(timeLeft, 0)} giây`}
  </div>
);

export default Timer;
