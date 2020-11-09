import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { remote } from 'electron';

const Icons = () => {
  const getCurrentWindow = () => remote.getCurrentWindow();

  const handleCloseWindow = (browserWindow = getCurrentWindow()) => {
    browserWindow.close();
  };
  const minimizeWindow = (browserWindow = getCurrentWindow()) => {
    browserWindow.minimize();
  };
  const maxUnmaxWindow = (browserWindow = getCurrentWindow()) => {
    if (browserWindow.isMaximized()) {
      browserWindow.unmaximize();
    } else {
      browserWindow.maximize();
    }
  };
  return (
    <div className="d-flex flex-row justify-content-between">
      <MinimizeIcon fontSize="small" onClick={() => minimizeWindow()} />
      <WebAssetIcon fontSize="small" onClick={() => maxUnmaxWindow()} />
      <CloseIcon fontSize="small" onClick={() => handleCloseWindow()} />
    </div>
  );
};

export default Icons;
