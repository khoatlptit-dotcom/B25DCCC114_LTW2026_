const Lifelines = ({ used, disabled, onFifty, onAudience, onStop }) => (
  <div className="lifelines">
    <button type="button" disabled={disabled || used.fifty} onClick={onFifty}>
      50:50
    </button>
    <button type="button" disabled={disabled || used.audience} onClick={onAudience}>
      Hỏi khán giả
    </button>
    <button type="button" disabled={disabled || used.stop} onClick={onStop}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;
