// state: 'normal' | 'locked' | 'correct' | 'wrong'
const AnswerButton = ({ letter, text, state, hidden, disabled, onClick }) => (
  <button
    type="button"
    className={`answer ${state} ${hidden ? 'answer-hidden' : ''}`}
    disabled={disabled || hidden}
    onClick={onClick}
  >
    {hidden ? '' : `${letter}. ${text}`}
  </button>
);

export default AnswerButton;
