import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    <h4>Ý kiến khán giả</h4>
    {percents.map((p, i) => (
      <div className="bar-row" key={i}>
        <span className="bar-label">{`${LETTERS[i]}: ${p}%`}</span>
        <div className="bar" style={{ width: `${p}%` }} />
      </div>
    ))}
  </div>
);

export default AudienceChart;
