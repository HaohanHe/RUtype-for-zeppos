import {
  keyboard,
  createWidget,
  widget as idOfWidget,
  createKeyboard,
  deleteKeyboard,
  inputType,
  align,
  text_style,
  deleteWidget,
  updateLayout,
  setStatusBarVisible,
} from "@zos/ui";

import { px } from "@zos/utils";

import { showToast } from "@zos/interaction";
import { scrollTo } from "@zos/page";
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from "@zos/device";
import { exit } from "@zos/router";
import { getPackageInfo } from "@zos/app";
import { launchApp } from "@zos/router";

const device_info = getDeviceInfo();
const appName = "RUtype";

function keyboard_isEnabled() {
  try {
    if (keyboard && typeof keyboard.isEnabled === 'function') {
      return keyboard.isEnabled();
    }
  } catch (e) {
    console.log("keyboard_isEnabled error", e);
  }
  return true;
}

function keyboard_isSelected() {
  try {
    if (keyboard && typeof keyboard.isSelected === 'function') {
      return keyboard.isSelected();
    }
  } catch (e) {
    console.log("keyboard_isSelected error", e);
  }
  return true;
}

function keyboard_gotoSettings() {
  try {
    if (keyboard && typeof keyboard.gotoSettings === 'function') {
      return keyboard.gotoSettings();
    }
  } catch (e) {
    console.log("keyboard_gotoSettings error", e);
  }
  launchApp({ url: "Settings_keyboardScreen", native: true });
}

const unit = {
  p(v) {
    return `${v}%`;
  },
  f() {
    return "100%";
  },
  x(v) {
    return typeof v !== "undefined" ? `${v}` : "0";
  },
  z() {
    return "0";
  },
  wrap_content() {
    return "auto";
  },
  vh(v) {
    return `${v}vw`;
  },
  h1() {
    return "100vh";
  },
  vw(v) {
    return `${v}vw`;
  },
  w1() {
    return "100vw";
  },
  il() {
    return "ignore-layout";
  },
  fx() {
    return "flex";
  },
  col() {
    return "column";
  },
  row() {
    return "row";
  },
};

class Ref {
  constructor(val) {
    this.current = val;
  }
}

function ref(val) {
  return new Ref(val);
}

let protoOf = Object.getPrototypeOf;
let widget_opts_proto = {};
let objProto = protoOf(widget_opts_proto);

function create_widget_node(ctx, name, ...args) {
  const id_name = name.toUpperCase();
  const id = idOfWidget[id_name];

  if (!id) {
    throw new Error(`error: widget id ${id_name} is not exist`);
  }

  let [props, ...children] =
    protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];

  props.id = id;
  props.id_name = id_name;
  props.children = children;

  if (ctx) {
    props.parent = ctx.parent;
    props.layout_parent = ctx.layout_parent;
  }

  return {
    __proto__: widget_opts_proto,
    id,
    props,
  };
}

let handler = (ctx) => ({
  get: (_, name) => create_widget_node.bind(undefined, ctx, name),
});

let widgets = new Proxy(
  (ctx) => new Proxy(create_widget_node, handler(ctx)),
  handler()
);

function createElement(id_, opts) {
  let [
    id,
    {
      id_name = "UNKNOWN",
      ref,
      layout_parent,
      parent,
      children,
      ...widget_props
    },
  ] = protoOf(id_) === widget_opts_proto ? [id_.id, id_.props] : [id_, opts];

  widget_props.parent =
    layout_parent instanceof Ref ? layout_parent.current : layout_parent;

  if (widget_props.parent) {
    widget_props.layout = widget_props.layout ?? {};
  }

  parent = parent instanceof Ref ? parent.current : parent ?? { createWidget };
  const ele = parent.createWidget(id, widget_props);
  if (!ele) {
    throw new Error(`error: create widget ${id} ${id_name} is undefined`);
  }
  ele.parent = parent;

  if (ref) {
    ref.current = ele;
  }

  if (children && children.length > 0) {
    let children_parent = ele.parent;
    let children_layout_parent = ele.layoutParent;
    if (id === idOfWidget.VIRTUAL_CONTAINER) {
      children_layout_parent = ele;
    } else if ([idOfWidget.GROUP, idOfWidget.VIEW_CONTAINER].includes(id)) {
      children_parent = ele;
      if (ele.isAutoLayout) {
        children_layout_parent = ele;
      }
    } else {
      throw new Error(
        `error: child widget parent ${id} ${id_name} is not container type`
      );
    }

    children.forEach((opts) => {
      let child_id;
      let child_widget_props;
      if (Array.isArray(opts)) {
        child_id = opts[0];
        child_widget_props = opts[1];
      } else if (protoOf(opts) === widget_opts_proto) {
        child_id = opts.id;
        child_widget_props = opts.props;
      } else {
        throw new Error(`error: create child widget opts is error`);
      }

      child_widget_props.parent = child_widget_props.parent ?? children_parent;
      child_widget_props.layout_parent =
        child_widget_props.layout_parent ?? children_layout_parent;
      createElement(child_id, child_widget_props);
    });
  }

  return ele;
}

function removeElement(ele) {
  if (ele.layoutChildren) {
    ele.layoutChildren.forEach((child) => {
      removeElement(child);
    });
  }

  if (ele.parent && ele.parent.deleteWidget) {
    ele.parent.deleteWidget(ele);
  } else {
    deleteWidget(ele);
  }
}

const default_text_style = {
  color: 0xffffff,
  align_v: align.CENTER_V,
  align_h: align.CENTER_H,
  text_style: text_style.CHAR_WRAP,
};

const default_layout = {};

Page({
  state: {
    vc: null,
  },
  onInit() {
    setStatusBarVisible(false);
  },
  build() {
    const isEnable = keyboard_isEnabled();
    const isSelected = keyboard_isSelected();

    if (isEnable && isSelected) {
      this.build_setting_page();
    } else {
      this.build_init_page();
    }
  },
  onResume() {
    this.clear_page();
    this.build();
    if (this.state.vc && this.state.vc.current) {
      updateLayout(this.state.vc.current);
    }
    scrollTo({ y: 0 });
  },
  clear_page() {
    if (this.state.vc && this.state.vc.current) {
      removeElement(this.state.vc.current);
      this.state.vc.current = null;
    }
  },
  build_init_page() {
    const vc = ref(null);
    this.state.vc = vc;

    [
      [
        idOfWidget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            ...default_layout,
            left: unit.z(),
            top: unit.z(),
            width: unit.w1(),
            height: unit.h1(),
            display: unit.fx(),
            flex_flow: unit.col(),
            row_gap: px(25),
            padding_top: px(40),
            padding_left: px(72),
            padding_right: px(72),
          },
        },
      ],
      [
        idOfWidget.TEXT,
        {
          text: `Включить ${appName}`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: unit.wrap_content(),
            font_size: px(40),
          },
        },
      ],
      [
        idOfWidget.IMG,
        {
          src: "image/keyboard_enable.png",
          auto_scale: true,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: px(336),
            height: px(126),
          },
        },
      ],
      [
        idOfWidget.TEXT,
        {
          text: "Коснитесь и удерживайте кнопку глобуса на клавиатуре, затем выберите RUtype",
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: unit.wrap_content(),
            font_size: px(36),
          },
        },
      ],
      [
        idOfWidget.BUTTON,
        {
          text: "Показать клавиатуру",
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func: () => {
            this.keyboard(() => {
              this.onResume();
            });
          },
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: px(88),
            font_size: px(36),
            corner_radius: px(44),
          },
        },
      ],
      [
        idOfWidget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: px(100),
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  build_setting_page() {
    const vc = ref(null);
    this.state.vc = vc;

    showToast({
      content: "Все готово",
    });

    [
      [
        idOfWidget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            ...default_layout,
            left: unit.z(),
            top: unit.z(),
            width: unit.w1(),
            height: unit.h1(),
            display: unit.fx(),
            flex_flow: unit.col(),
            row_gap: px(25),
            padding_top: px(40),
            padding_left: px(72),
            padding_right: px(72),
          },
        },
      ],
      [
        idOfWidget.TEXT,
        {
          text: appName,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: unit.wrap_content(),
            font_size: px(40),
          },
        },
      ],
      [
        idOfWidget.BUTTON,
        {
          text: "Показать клавиатуру",
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func: () => {
            this.keyboard();
          },
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: px(88),
            font_size: px(36),
            corner_radius: px(44),
          },
        },
      ],
      [
        idOfWidget.BUTTON,
        {
          text: "Перейти в настройки",
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func: () => {
            keyboard_gotoSettings();
          },
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: px(88),
            font_size: px(36),
            corner_radius: px(44),
          },
        },
      ],
      [
        idOfWidget.BUTTON,
        {
          text: "Выйти",
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func() {
            exit();
          },
          layout_parent: vc,
          layout: {
            width: unit.f(),
            height: px(88),
            font_size: px(36),
            corner_radius: px(44),
          },
        },
      ],
      [
        idOfWidget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: unit.f(),
            height: px(100),
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },

  keyboard(cb) {
    createKeyboard({
      onComplete: (kb, result) => {
        console.log("complete");
        deleteKeyboard();
        showToast({
          content: "Ввод: " + result.data,
        });
        cb && cb();
      },
      onCancel: () => {
        console.log("cancel");
        deleteKeyboard();
        cb && cb();
      },
    });
  },
});
