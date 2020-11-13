import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Label, CustomInput } from 'reactstrap';
import { setURL } from '../Redux/redux-reducers';

const UrlHandler = props => (
  <div className="mt-3 d-flex flex-column">
    <FormGroup className="mt-3 w-50">
      <Label for="action">
        <span>URL: </span>
      </Label>
      <CustomInput type="file" id="customFolderInput" onChange={e => props.setURL(e.target.value)} />
    </FormGroup>
  </div>
);

const mapStateToProps = state => ({ url: state.url });

export default connect(mapStateToProps, { setURL })(UrlHandler);
