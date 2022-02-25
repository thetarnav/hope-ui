import { Property } from "csstype";
import { JSX, mergeProps, Show, splitProps } from "solid-js";

import { SpaceScaleValue } from "@/styled-system";
import { useThemeComponentStyles } from "@/theme/provider";
import { classNames, createClassSelector } from "@/utils/css";

import { hope } from "../factory";
import { ElementType, HTMLHopeProps } from "../types";
import { buttonStyles, ButtonVariants } from "./button.styles";
import { ButtonIcon } from "./button-icon";
import { ButtonLoader } from "./button-loader";

export interface ButtonOptions extends ButtonVariants {
  /**
   * If `true`, the button will be disabled.
   */
  disabled?: boolean;

  /**
   * The label to show in the button when `loading` is true
   * If no text is passed, it only shows the loader
   */
  loadingText?: string;

  /**
   * Replace the loader component when `loading` is set to `true`
   */
  loader?: JSX.Element;

  /**
   * It determines the placement of the loader when isLoading is true
   */
  loaderPlacement?: "start" | "end";

  /**
   * The space between the button icon and label.
   */
  iconSpacing?: Property.MarginRight<SpaceScaleValue>;

  /**
   * If added, the button will show an icon before the button's label.
   */
  leftIcon?: JSX.Element;

  /**
   * If added, the button will show an icon after the button's label.
   */
  rightIcon?: JSX.Element;
}

export type ThemeableButtonOptions = Pick<ButtonOptions, "variant" | "colorScheme" | "size" | "loaderPlacement">;

export type ButtonProps<C extends ElementType = "button"> = HTMLHopeProps<C, ButtonOptions>;

const hopeButtonClass = "hope-button";

/**
 * The Button component is used to trigger an action or event,
 * such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 */
export function Button<C extends ElementType = "button">(props: ButtonProps<C>) {
  const theme = useThemeComponentStyles().Button;

  const defaultProps: ButtonProps<"button"> = {
    as: "button",
    __baseStyle: theme?.baseStyle,
    variant: theme?.defaultProps?.variant ?? "solid",
    colorScheme: theme?.defaultProps?.colorScheme ?? "primary",
    size: theme?.defaultProps?.size ?? "md",
    loaderPlacement: theme?.defaultProps?.loaderPlacement ?? "start",
    loading: false,
    disabled: false,
    iconSpacing: "0.5rem",
    type: "button",
    role: "button",
  };

  const propsWithDefault: ButtonProps<"button"> = mergeProps(defaultProps, props);
  const [local, variantProps, contentProps, others] = splitProps(
    propsWithDefault,
    ["class", "__baseStyle", "disabled", "loadingText", "loader", "loaderPlacement"],
    ["variant", "colorScheme", "size", "loading", "compact", "fullWidth"],
    ["children", "iconSpacing", "leftIcon", "rightIcon"]
  );

  const classes = () => classNames(local.class, hopeButtonClass, buttonStyles(variantProps));

  return (
    <hope.button class={classes()} disabled={local.disabled} __baseStyle={local.__baseStyle} {...others}>
      <Show when={variantProps.loading && local.loaderPlacement === "start"}>
        <ButtonLoader
          class="hope-button__loader--start"
          withLoadingText={!!local.loadingText}
          placement="start"
          spacing={contentProps.iconSpacing}
        >
          {local.loader}
        </ButtonLoader>
      </Show>

      <Show when={variantProps.loading} fallback={<ButtonContent {...contentProps} />}>
        <Show
          when={local.loadingText}
          fallback={
            <hope.span opacity={0}>
              <ButtonContent {...contentProps} />
            </hope.span>
          }
        >
          {local.loadingText}
        </Show>
      </Show>

      <Show when={variantProps.loading && local.loaderPlacement === "end"}>
        <ButtonLoader
          class="hope-button__loader--end"
          withLoadingText={!!local.loadingText}
          placement="end"
          spacing={contentProps.iconSpacing}
        >
          {local.loader}
        </ButtonLoader>
      </Show>
    </hope.button>
  );
}

Button.toString = () => createClassSelector(hopeButtonClass);

type ButtonContentProps = Pick<ButtonProps, "iconSpacing" | "leftIcon" | "rightIcon" | "children">;

function ButtonContent(props: ButtonContentProps) {
  return (
    <>
      <Show when={props.leftIcon}>
        <ButtonIcon marginEnd={props.iconSpacing}>{props.leftIcon}</ButtonIcon>
      </Show>
      {props.children}
      <Show when={props.rightIcon}>
        <ButtonIcon marginStart={props.iconSpacing}>{props.rightIcon}</ButtonIcon>
      </Show>
    </>
  );
}
