import { createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from "solid-js";

import { SystemStyleObject } from "@/styled-system/types";
import { useComponentStyleConfigs } from "@/theme/provider";
import { classNames, createClassSelector } from "@/utils/css";
import { callAllHandlers } from "@/utils/function";

import { Box } from "../box/box";
import { hope } from "../factory";
import { ElementType, HTMLHopeProps } from "../types";
import {
  radioContainerStyles,
  RadioContainerVariants,
  radioControlStyles,
  RadioControlVariants,
  radioInputStyles,
  radioLabelStyles,
} from "./radio.styles";
import { useRadioGroupContext } from "./radio-group";

export type ThemeableRadioOptions = RadioContainerVariants & RadioControlVariants;

interface RadioOptions extends ThemeableRadioOptions {
  /**
   * The ref to be passed to the internal <input> tag.
   */
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);

  /**
   * The name of the input field in a radio
   * (Useful for form submission).
   */
  name?: string;

  /**
   * The value to be used in the radio input.
   * This is the value that will be returned on form submission.
   */
  value?: string | number;

  /**
   * If `true`, the radio will be checked.
   * You'll need to pass `onChange` to update its value (since it is now controlled)
   */
  checked?: boolean;

  /**
   * If `true`, the radio will be initially checked.
   */
  defaultChecked?: boolean;

  /**
   * If `true`, the radio input is marked as required,
   * and `required` attribute will be added
   */
  required?: boolean;

  /**
   * If `true`, the radio will be disabled
   */
  disabled?: boolean;

  /**
   * If `true`, the radio will be readonly
   */
  readOnly?: boolean;

  /**
   * If `true`, the input will have `aria-invalid` set to `true`
   */
  invalid?: boolean;

  /**
   * The callback invoked when the checked state of the `Radio` changes.
   */
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;

  /**
   * The callback invoked when the radio is focused
   */
  onFocus?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;

  /**
   * The callback invoked when the radio is blurred (loses focus)
   */
  onBlur?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;
}

export type RadioProps<C extends ElementType = "label"> = HTMLHopeProps<C, RadioOptions>;

export interface RadioStyleConfig {
  baseStyle?: {
    root?: SystemStyleObject;
    group?: SystemStyleObject;
    control?: SystemStyleObject;
    label?: SystemStyleObject;
  };
  defaultProps?: {
    root?: ThemeableRadioOptions;
    group?: ThemeableRadioOptions;
  };
}

const hopeRadioClass = "hope-radio";
const hopeRadioInputClass = "hope-radio__input";
const hopeRadioControlClass = "hope-radio__control";
const hopeRadioLabelClass = "hope-radio__label";

export function Radio<C extends ElementType = "label">(props: RadioProps<C>) {
  const defaultId = `hope-radio-${createUniqueId()}`;

  const theme = useComponentStyleConfigs().Radio;

  const radioGroupContext = useRadioGroupContext();

  const defaultProps: RadioProps<"label"> = {
    as: "label",
    id: defaultId,
    variant: radioGroupContext?.state?.variant ?? theme?.defaultProps?.root?.variant ?? "outline",
    colorScheme: radioGroupContext?.state?.colorScheme ?? theme?.defaultProps?.root?.colorScheme ?? "primary",
    size: radioGroupContext?.state?.size ?? theme?.defaultProps?.root?.size ?? "md",
    labelPosition: radioGroupContext?.state?.labelPosition ?? theme?.defaultProps?.root?.labelPosition ?? "right",

    name: radioGroupContext?.state.name,
    required: radioGroupContext?.state.required,
    disabled: radioGroupContext?.state.disabled,
    readOnly: radioGroupContext?.state.readOnly,
    invalid: radioGroupContext?.state.invalid,
  };

  const propsWithDefaults: RadioProps<"label"> = mergeProps(defaultProps, props);
  const [local, inputProps, variantProps, others] = splitProps(
    propsWithDefaults,
    ["checked", "defaultChecked", "invalid", "onChange", "class", "children"],
    [
      "ref",
      "id",
      "name",
      "value",
      "required",
      "disabled",
      "readOnly",
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "tabIndex",
      "onFocus",
      "onBlur",
    ],
    ["variant", "colorScheme", "size", "labelPosition"]
  );

  // Internal state for uncontrolled radio.
  // eslint-disable-next-line solid/reactivity
  const [checkedState, setCheckedState] = createSignal(!!local.defaultChecked);

  const isControlled = () => local.checked !== undefined;
  const checked = () => {
    if (radioGroupContext?.state.value != null && inputProps?.value != null) {
      return radioGroupContext.state.value === inputProps.value;
    }

    return isControlled() ? local.checked : checkedState();
  };

  // Input loose focus if this is placed in `dataAttrs()`
  const dataChecked = () => (checked() ? "" : undefined);

  const dataAttrs = () => ({
    "data-required": inputProps.required ? "" : undefined,
    "data-disabled": inputProps.disabled ? "" : undefined,
    "data-invalid": local.invalid ? "" : undefined,
    "data-readonly": inputProps.readOnly ? "" : undefined,
  });

  const ariaAttrs = () => ({
    "aria-required": inputProps.required ? true : undefined,
    "aria-disabled": inputProps.disabled ? true : undefined,
    "aria-invalid": local.invalid ? true : undefined,
    "aria-readonly": inputProps.readOnly ? true : undefined,
  });

  const containerClasses = () => {
    return classNames(local.class, hopeRadioClass, radioContainerStyles(variantProps));
  };

  const inputClasses = () => classNames(hopeRadioInputClass, radioInputStyles());

  const controlClasses = () => {
    return classNames(hopeRadioControlClass, radioControlStyles(variantProps));
  };

  const labelClasses = () => classNames(hopeRadioLabelClass, radioLabelStyles(variantProps));

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    if (inputProps.readOnly || inputProps.disabled) {
      event.preventDefault();
      return;
    }

    if (!isControlled()) {
      const target = event.target as HTMLInputElement;
      setCheckedState(target.checked);
    }

    callAllHandlers(radioGroupContext?.onChange, local.onChange)(event);
  };

  return (
    <Box
      as="label"
      class={containerClasses()}
      __baseStyle={theme?.baseStyle?.root}
      for={inputProps.id}
      data-checked={dataChecked()}
      {...dataAttrs}
      {...others}
    >
      <input
        type="radio"
        class={inputClasses()}
        checked={checked()}
        onChange={onChange}
        {...inputProps}
        {...ariaAttrs}
      />
      <hope.span
        aria-hidden={true}
        class={controlClasses()}
        __baseStyle={theme?.baseStyle?.control}
        data-checked={dataChecked()}
        {...dataAttrs}
      />
      <Show when={local.children}>
        <hope.span
          class={labelClasses()}
          __baseStyle={theme?.baseStyle?.label}
          data-checked={dataChecked()}
          {...dataAttrs}
        >
          {local.children}
        </hope.span>
      </Show>
    </Box>
  );
}

Radio.toString = () => createClassSelector(hopeRadioClass);