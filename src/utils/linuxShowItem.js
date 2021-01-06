/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
const { execFile } = require('child_process');

const parseName = name => name
  .replace(/\s+/g, '')
  .split('.')
  .filter(key => key !== 'org' && key !== 'desktop')
  .join('-');

const run = (command, args, callback, handleError) => {
  execFile(command, args, (error, stdout, stderr) => {
    error || stderr ? handleError(error || stderr) : callback(stdout);
  });
};

const showItemInFolder = path => {
  const args = ['query', 'default', 'inode/directory'];
  run(
    'xdg-mime',
    args,
    name => {
      // Get default File-manager application
      const fileManager = name ? parseName(name) : null;
      // Open file-manager and select file
      run(
        fileManager,
        [path],
        () => true,
        () => false,
      );
      // handle errors
    },
    error => console.log(error),
  );
};

export default showItemInFolder;
