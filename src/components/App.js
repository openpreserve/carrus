import { stderr, stdin, stdout } from "process";
import React, { useEffect, useState } from "react";

const { exec } = require("child_process");

const App = () => {
  const [output, setOutput] = useState("");

  const runPythonScript = () => {
    exec("python ./src/python/script.py", (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      setOutput(stdout);
    });
  };
  return (
    <div>
      <span>
        Click the button and the output of a py script will be shown here
        ---&gt; {output}
      </span>
      <button onClick={() => runPythonScript()}>Click me</button>
    </div>
  );
};

export default App;
