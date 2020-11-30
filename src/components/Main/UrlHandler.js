import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Label, Input } from 'reactstrap';
import { setURL } from '../../Redux/redux-reducers';

const UrlHandler = props => (
  <div className="mt-3 d-flex flex-column">
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="action" className="mr-1 my-auto w-25">
        <span>URL: </span>
      </Label>
      <Input
        type="url"
        name="url"
        id="exampleUrl"
        placeholder="Your url"
        onChange={e => props.setURL(e.target.value)}
      />
    </FormGroup>
  </div>
);

const mapStateToProps = state => ({ url: state.url });

export default connect(mapStateToProps, { setURL })(UrlHandler);
