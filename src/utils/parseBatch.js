import { readdirSync, lstatSync } from 'fs';
import { connect } from 'react-redux';

async function parseBatch(props) {
  const { batchPath, recursive } = props;
  try {
    readdirSync(batchPath, 'utf8')
      .map(item => {
        const path = `${batchPath}/${item}`;
        const isDir = lstatSync(path)
          .isDirectory();
        return {
          name: item,
          path,
          isDir,
          recursive,
        };
      });
  } catch (error) {
    console.log('failed');
  } finally {
    console.log(batchPath);
  }
}

const mapStateToProps = state => ({
  batchPath: state.batchPath,
  recursive: state.recursive,
});
export default connect(mapStateToProps)(parseBatch);
