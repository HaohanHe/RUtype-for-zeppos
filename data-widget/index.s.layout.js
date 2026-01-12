import { px } from "@zos/utils";
import { align, text_style } from "@zos/ui";
import { getDeviceInfo } from "@zos/device";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

export const styles = {
  container: {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: DEVICE_HEIGHT,
    layout: {
      width: DEVICE_WIDTH + 'px',
      height: DEVICE_HEIGHT + 'px',
      'display': 'flex',
      'flex-flow': 'column',
      'justify-content': 'flex-start',
      'align-items': 'center',
      'padding-top': '170px', 
    }
  },
  previewArea: {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: 0,
    show: false,
  },
  keyboard: {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: 340, 
    layout: {
      width: DEVICE_WIDTH + 'px',
      height: '340px',
      display: 'flex',
      'flex-flow': 'column',
      'justify-content': 'flex-start',
      'align-items': 'center',
      'margin-left': '0px',
      'margin-right': '0px',
      'padding-left': '0px',
      'padding-right': '0px',
    }
  },
  keyboardRow: {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: 52,
    layout: {
      display: 'flex',
      'flex-flow': 'row',
      'justify-content': 'center',
      'align-items': 'center',
      width: DEVICE_WIDTH + 'px',
      height: '52px',
      'margin-bottom': '6px',
      'padding-left': '0px',
      'padding-right': '0px',
    }
  },
  keyButton: {
    color: 0xffffff,
    normal_color: 0x262626,
    press_color: 0x404040,
    radius: 8,
    layout: {
      width: '32px',
      height: '44px',
      'margin-left': '3px',
      'margin-right': '3px',
      'font-size': '22px',
    }
  },
  keyButtonRow0: {
    layout: { width: '32px', height: '44px' }
  },
  keyButtonRow1: {
    layout: { width: '32px', height: '44px' }
  },
  keyButtonRow2: {
    layout: { width: '32px', height: '44px' }
  },
  shiftKey: {
    normal_color: 0x404040,
    text: "⇧",
    layout: {
      width: '40px',
      height: '44px',
      'font-size': '22px',
      'margin-right': '6px',
    }
  },
  functionButtonsContainer: {
    w: DEVICE_WIDTH,
    h: 70,
    layout: {
      display: 'flex',
      'flex-flow': 'row',
      'justify-content': 'center',
      'align-items': 'center',
      width: DEVICE_WIDTH + 'px',
      height: '70px',
      'margin-top': '10px',
      'padding-left': '0px',
      'padding-right': '0px',
    }
  },
  bottomFuncKey: {
    color: 0xffffff,
    normal_color: 0x262626,
    press_color: 0x404040,
    radius: 25,
    layout: {
      width: '110px',
      height: '50px',
      'margin-left': '8px',
      'margin-right': '8px',
      'font-size': '28px',
    }
  },
  globeKey: {
    text_color: 0x409EFF,
  },
  enterKey: {
    text: "↵",
  },
  checkKey: {
    normal_color: 0x409EFF,
    color: 0xffffff,
    text: "✓",
  }
};
