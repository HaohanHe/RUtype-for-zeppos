import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import {
  createWidget,
  widget,
  align,
  prop,
  text_style,
  event,
  keyboard,
} from "@zos/ui";

const { width: device_width, height: device_height } = getDeviceInfo();
const { h } = keyboard.getContentRect();

// 圆屏设备安全边距 - 避免圆角裁剪
const SAFE_MARGIN = 2;

export const styles = {
  container: {
    layout: {
      display: "flex",
      flex_flow: "column wrap",
      justify_content: "start",
      align_items: "center",
      align_content: "center",
      top: h + "",
      width: "100vw",
      height: "100vh",
    },
  },

  keyboard: {
    layout: {
      display: "flex",
      flex_flow: "column",
      gap: "2",
      width: "100%",
      flex_grow: "1",
      // 圆屏安全边距
      padding: `${SAFE_MARGIN}px`,
    },
  },
  
  // 字母键盘行 - 标准圆屏适配
  keyboardRow: {
    layout: {
      display: "flex",
      flex_flow: "row wrap",
      justify_content: "center",
      align_items: "center",
      align_content: "center",
      width: "100%",
      height: "15vh",
      column_gap: "2",
    },
  },
  
  // 字母按键 - 使用百分比宽度适配圆屏
  keyButton: {
    radius: 10,
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    layout: {
      height: "100%",
      width: "9.5%",  // 10个按键，留出间距
      font_size: "40",
    },
  },

  // 底部功能按钮容器 - 圆屏专用布局
  functionButtonsContainer: {
    layout: {
      display: "flex",
      flex_flow: "column wrap",
      justify_content: "center",
      align_items: "center",
      width: "100%",
      height: "20vh",  // 两行功能按钮
      gap: "1",
      padding: `${SAFE_MARGIN}px`,
    },
  },

  // 第一行功能按钮：🌐、Пробел、Ввод（对齐布局）
  functionRow1: {
    layout: {
      display: "flex",
      flex_flow: "row wrap",
      justify_content: "space-between",
      align_items: "center",
      width: "100%",
      height: "9vh",
      gap: "2",
    },
  },

  // 第二行功能按钮：АБВ、Удалить（居中布局）
  functionRow2: {
    layout: {
      display: "flex",
      flex_flow: "row wrap",
      justify_content: "space-around",
      align_items: "center",
      width: "100%",
      height: "9vh",
      gap: "2",
    },
  },

  // 功能按钮样式 - 圆屏优化
  functionButton: {
    text: "Очистить",
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    radius: 10,
    layout: {
      height: "100%",
      font_size: "32",
      min_width: "40",
    },
  },

  // 第一行按钮：各占30%宽度，确保对齐
  functionButtonRow1: {
    width: "30%",  // 三个按钮各占30%，总和90%，留10%间距
  },

  // 第二行按钮：各占45%宽度
  functionButtonRow2: {
    width: "45%",  // 两个按钮各占45%，总和90%，留10%间距
  },
};
