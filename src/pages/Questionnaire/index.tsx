import React, { useState } from 'react';
import { Button, Input, Checkbox, List } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import { useHistory, useDispatch, useSelector } from 'dva';
import styles from './index.scss';

const questions = Array(7)
  .fill(0)
  .map((_, idx) => {
    return `org.questionnaire.question${idx + 1}`;
  });

const Questionnaire = () => {
  const history = useHistory();
  const [reasons, setReasons] = useState('');
  const [extraMsg, setExtraMsg] = useState('');
  const dispatch = useDispatch();
  const submitting = useSelector(
    ({ loading }) => loading.effects['organization/dissolveReasonMessage'],
  );

  return (
    <div className={styles.container}>
      <div className={styles.questionContent}>
        <h2>
          <FM id="org.questionnaire.title" />
        </h2>
        <Checkbox.Group
          style={{ width: '100%', margin: '24px 0' }}
          onChange={(selected) => {
            setReasons(selected.join(';'));
          }}
        >
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={questions}
            renderItem={(item) => (
              <List.Item key={item}>
                <FM id={item}>{(text: string) => <Checkbox value={text}>{text}</Checkbox>}</FM>
              </List.Item>
            )}
          />
        </Checkbox.Group>
        <FM id="org.questionnaire.help">
          {(text: string) => (
            <Input.TextArea
              rows={5}
              placeholder={text}
              onChange={(e) => setExtraMsg(e.target.value)}
            />
          )}
        </FM>
        <div className={styles.buttonGroups}>
          <Button onClick={() => history.replace('/home')}>
            <FM id="dict.cancel" />
          </Button>
          <Button
            type="primary"
            loading={submitting}
            onClick={() => {
              dispatch({
                type: 'organization/submitDissolutionSurvey',
                payload: {
                  remarks: extraMsg,
                  dissolveReasonMessage: reasons,
                },
              }).finally(() => {
                history.replace('/home');
              });
            }}
          >
            <FM id="dict.submit" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
