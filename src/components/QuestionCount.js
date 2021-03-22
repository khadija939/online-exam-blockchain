import React from 'react';

function QuestionCount(props) {
  return (
    <div style={{ fontWeight: 'bold' }}>
      Question <span>{props.counter}</span> of <span>{props.total + (props.result ? ` - Marks Obtained(${props.marks})` : ` - Marks(${props.marks})`)}</span>
    </div>
  );
}

export default QuestionCount;