import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({
  number,
  total,
  question,
  options,
  answer,
  selected,
  status,
  hidden,
  onSelect,
}) => {
  const getState = (i) => {
    if (status === 'locked' && i === selected) return 'locked';
    if (status === 'revealed') {
      if (i === answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return 'normal';
  };

  return (
    <section className="question-card">
      <h3>{`Câu ${number}/${total}`}</h3>
      <p className="question-text">{question}</p>
      <div className="answers">
        {options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            hidden={hidden.includes(i)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default QuestionCard;
