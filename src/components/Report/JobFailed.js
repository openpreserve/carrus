import React from 'react';
import { Container, Jumbotron, Button } from 'reactstrap';
import CancelIcon from '@material-ui/icons/Cancel';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';

const JobFailed = () => (
  <Container>
    <Jumbotron className="p-4 bg-white mt-5 d-flex flex-column align-items-center">
      <div className="d-flex flex-column align-items-center mb-5">
        <CancelIcon style={{ fontSize: 70 }} color="secondary" className="mb-3" />
        <span style={{ color: 'red', fontSize: 25 }}>Job Failed</span>
      </div>
      <div className="mt-5">
        <Checkbox style={{ color: green[500] }} />
        <span className="mx-auto">Include the input file into the report</span>
      </div>
      <Button color="danger">Send Report</Button>
    </Jumbotron>
  </Container>
);

export default JobFailed;
