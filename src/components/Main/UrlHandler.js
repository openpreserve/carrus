/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input, FormFeedback, InputGroup } from 'reactstrap';
import { setURL } from '../../Redux/redux-reducers';

const UrlHandler = props => {
  const { url, isValid, feedback, isEmpty } = props;
  const { t } = useTranslation();

  return (
    <div className="mt-3 d-flex flex-column">
      <FormGroup className="mt-3 w-100 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>URL: </span>
        </Label>
        <InputGroup className="w-50">
          <Input
            type="url"
            name="url"
            id="exampleUrl"
            placeholder="Your url"
            onChange={e => {
              document.querySelectorAll('select')[0].value = t('chooseAllowedActionTypes');
              props.setURL(e.target.value);
            }}
            value={url}
            valid={isValid && !isEmpty}
            invalid={!isValid && !isEmpty}
          />
          {!isValid && <FormFeedback tooltip>{feedback}</FormFeedback>}
        </InputGroup>
      </FormGroup>
    </div>
  );
};

const mapStateToProps = state => ({ url: state.url, config: state.config });

export default connect(mapStateToProps, { setURL })(UrlHandler);
