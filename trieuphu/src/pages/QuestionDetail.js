import { Link, useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="error">{error}</p>;

  const question = questions.find((q) => q.id === Number(id));

  return (
    <div>
      {question ? (
        <>
          <h2>{`Câu hỏi số ${question.id} (${LEVELS[question.level]})`}</h2>
          <p className="question-text">{question.question}</p>
          <ul className="detail-options">
            {question.options.map((option, i) => (
              <li key={i} className={i === question.answer ? 'correct' : ''}>
                {`${LETTERS[i]}. ${option}`}
                {i === question.answer && ' (Đáp án đúng)'}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Không tìm thấy câu hỏi</h2>
          <Link to="/questions">Về ngân hàng câu hỏi</Link>
        </>
      )}
      <div>
        <button type="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
