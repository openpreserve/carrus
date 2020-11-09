import React, { useState } from 'react';

import { exec } from 'child_process';

const libsPath = './src/libs';

const App = () => {
  const [output, setOutput] = useState('');

  const runPythonScript = () => {
    exec(`python ${libsPath}/script.py`, (error, stdout) => {
      if (error) {
        throw error;
      }
      setOutput(stdout);
    });
  };

  return (
    <div>
      <span>
        Click the button and the output of a py script will be shown here ---&gt;
        {output}
      </span>
      <button type="submit" onClick={() => runPythonScript()}>
        Click me
      </button>
    </div>
  );
};

export default App;
