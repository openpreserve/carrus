/* eslint-disable import/prefer-default-export */
import os from 'os';

export const APP_NAME = 'OPFCarrus';
export const DEF_CONFIG = {
  defaultValues: {
    Identify: {
      AIFF: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      GIF: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      HTML: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      image: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      JPEG: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      JPEG2000: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      pdf: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      text: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      TIFF: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      WAVE: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      XML: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
      zip: {
        defaultAction: 'pronom only', defaultTool: 'FIDO',
      },
    },
  },
  defaultPath: os.homedir(),
};
