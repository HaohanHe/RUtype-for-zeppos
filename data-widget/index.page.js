import { getDeviceInfo } from "@zos/device";
import { styles } from "zosLoader:./index.[pf].layout.js";
import {
  createWidget,
  deleteWidget,
  updateLayout,
  widget,
  align,
  prop,
  text_style,
  event,
  keyboard,
  setAlpha,
} from "@zos/ui";

function createKeyboard() {
  return createWidget(widget.VIRTUAL_CONTAINER, styles.container);
}

DataWidget({
  state: {
    currentText: "",
    mainContainer: null,
    keyboardContainer: null,
    previewWidget: null,
    shiftState: 0, // 0: 小写, 1: 大写一次, 2: 大写锁定
  },

  setState(state) {
    for (const key in state) {
      this.state[key] = state[key];
    }
  },

  onInit() {
    if (keyboard) {
      if (typeof keyboard.setContentRect === 'function') {
        const { width, screenShape } = getDeviceInfo();
        let contentWidth = width;
        let contentX = 0;
        
        // 0: SQUARE, 1: ROUND
        if (screenShape === 0) { // SQUARE
           contentWidth = width - 40; 
           contentX = 20;
        } else { // ROUND
           contentWidth = width * 0.70;
           contentX = (width - contentWidth) / 2;
        }

        keyboard.setContentRect({
          x: contentX,
          y: 0,
          w: contentWidth,
          h: 160
        });
      }

      if (typeof keyboard.setCandidateViewVisible === 'function') {
        keyboard.setCandidateViewVisible(true);
      }
      if (typeof keyboard.setPreviewViewVisible === 'function') {
        keyboard.setPreviewViewVisible(true);
      }
      if (typeof keyboard.updateContentRect === 'function') {
        keyboard.updateContentRect({
          candidateViewHeight: 80,
          previewViewHeight: 80
        });
      }
    }
  },

  build() {
    const mainContainer = createKeyboard();
    this.state.mainContainer = mainContainer;

    if (styles.previewArea && styles.previewArea.h > 0 && styles.previewArea.show !== false) {
      const previewWidget = createWidget(widget.TEXT, {
        ...styles.previewArea,
        parent: mainContainer,
        text: this.state.currentText || " ",
      });
      this.state.previewWidget = previewWidget;
    }

    const keyboardContainer = createWidget(widget.VIRTUAL_CONTAINER, {
      ...styles.keyboard,
      parent: mainContainer,
    });
    this.state.keyboardContainer = keyboardContainer;
    
    this.renderRussianKeyboard(keyboardContainer);
    this.renderFunctionKeys(keyboardContainer);

    updateLayout();
    
    return mainContainer;
  },

  updatePreview() {
    if (this.state.previewWidget) {
      const text = (this.state.currentText && this.state.currentText.length > 0) ? this.state.currentText : " ";
      this.state.previewWidget.setProperty(prop.TEXT, text);
      updateLayout();
    }
  },

  renderRussianKeyboard(container) {
    const shiftState = this.state.shiftState;
    const isUpperCase = shiftState > 0;
    
    let row1 = ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"];
    let row2 = ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"];
    let row3 = ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"];

    if (isUpperCase) {
      row1 = row1.map(c => c.toUpperCase());
      row2 = row2.map(c => c.toUpperCase());
      row3 = row3.map(c => c.toUpperCase());
    }

    const russianLayout = [row1, row2, row3];

    return russianLayout.map((row, rowIndex) => {
      const specificRowStyle = styles[`keyboardRow${rowIndex}`];
      const rowStyle = specificRowStyle 
        ? { ...styles.keyboardRow, ...specificRowStyle, layout: { ...styles.keyboardRow.layout, ...specificRowStyle.layout } }
        : styles.keyboardRow;

      const rowContainer = createWidget(widget.VIRTUAL_CONTAINER, {
        parent: container,
        ...rowStyle,
      });

      if (rowIndex === 2) {
         let shiftText = "⇧";
         let shiftColor = styles.shiftKey.normal_color;
         
         if (shiftState === 1) {
           shiftText = "⬆️";
           shiftColor = 0x555555;
         } else if (shiftState === 2) {
           shiftText = "⏫";
           shiftColor = 0x409EFF;
         }

         createWidget(widget.BUTTON, {
          ...styles.keyButton,
          ...styles.shiftKey,
          text: shiftText,
          normal_color: shiftColor,
          parent: rowContainer,
          click_func: (e) => {
            this.toggleCase();
          },
        });
      }
      
      if (rowIndex === 2) {
        row.push("⌫");
      }
      
      return row.map((key) => {
        const specificKeyStyle = styles[`keyButtonRow${rowIndex}`];
        const keyButtonStyle = specificKeyStyle
          ? { ...styles.keyButton, ...specificKeyStyle, layout: { ...styles.keyButton.layout, ...specificKeyStyle.layout } }
          : styles.keyButton;

        let clickFunc = (e) => {
          this.handleCharacterInput(key);
        };

        let displayText = key;

        if (key === "⌫") {
          displayText = "乂";
          clickFunc = (e) => {
            this.handleDelete();
          };
        }

        return createWidget(widget.BUTTON, {
          ...keyButtonStyle,
          parent: rowContainer,
          text: displayText,
          click_func: clickFunc,
        });
      });
    });
  },

  renderFunctionKeys(container) {
    const functionContainer = createWidget(widget.VIRTUAL_CONTAINER, {
      ...styles.functionButtonsContainer,
      parent: container,
    });

    createWidget(widget.BUTTON, {
      ...styles.bottomFuncKey,
      ...styles.globeKey,
      parent: functionContainer,
      text: "🌐",
      click_func: (e) => {
        this.handleKeyboardSwitch();
      },
      longpress_func: () => {
        keyboard.sendFnKey(keyboard.SELECT);
      }
    });

    createWidget(widget.BUTTON, {
      ...styles.bottomFuncKey,
      ...styles.enterKey,
      parent: functionContainer,
      text: "Пробел",
      click_func: (e) => {
        this.handleSpace();
      },
    });

    createWidget(widget.BUTTON, {
      ...styles.bottomFuncKey,
      ...styles.checkKey,
      parent: functionContainer,
      text: "✓",
      click_func: (e) => {
        this.handleConfirm();
      },
    });
  },

  handleConfirm() {
      keyboard.sendFnKey(keyboard.ENTER);
  },

  handleCharacterInput(char) {
    this.commitText(char);
  },

  toggleCase() {
    const nextShiftState = (this.state.shiftState + 1) % 3;
    this.setState({ shiftState: nextShiftState });
    this.rebuildKeyboard();
  },

  handleDelete() {
    keyboard.sendFnKey(keyboard.BACKSPACE);
    if (this.state.currentText && this.state.currentText.length > 0) {
      this.state.currentText = this.state.currentText.slice(0, -1);
      this.updatePreview();
    }
  },

  handleDeleteAll() {
    keyboard.clearInput();
    this.state.currentText = "";
    this.updatePreview();
  },

  handleSpace() {
    this.commitText(' ');
  },

  handleEnter() {
    keyboard.sendFnKey(keyboard.ENTER);
  },

  handleCancel() {
    keyboard.sendFnKey(keyboard.CANCEL);
  },

  handleKeyboardSwitch() {
    keyboard.sendFnKey(keyboard.SWITCH);
  },

  handleKeyboardSwitchLong() {
    if (typeof keyboard.switchKeyboard === 'function') {
      keyboard.switchKeyboard();
    }
  },

  rebuildKeyboard() {
    if (this.state.keyboardContainer) {
      this.clearContainer(this.state.keyboardContainer);
      this.renderRussianKeyboard(this.state.keyboardContainer);
      this.renderFunctionKeys(this.state.keyboardContainer);
      updateLayout();
    }
  },

  clearContainer(container) {
    if (!container) return;
    const children = container.layoutChildren;
    if (children && children.length > 0) {
      for (let i = children.length - 1; i >= 0; i--) {
        deleteWidget(children[i]);
      }
    }
  },

  commitText(text) {
    keyboard.inputText(text);
    this.state.currentText += text;
    this.updatePreview();
    
    if (this.state.shiftState === 1) {
      this.setState({ shiftState: 0 });
      this.rebuildKeyboard();
    }
  },

  onResume() {
    if (keyboard) {
      if (typeof keyboard.setCandidateViewVisible === 'function') {
        keyboard.setCandidateViewVisible(true);
      }
      if (typeof keyboard.setPreviewViewVisible === 'function') {
        keyboard.setPreviewViewVisible(true);
      }
      if (typeof keyboard.updateContentRect === 'function') {
        keyboard.updateContentRect({
          candidateViewHeight: 80,
          previewViewHeight: 80
        });
      }
    }
  },

  onPause() {
  },

  onDestroy() {
  },
});
