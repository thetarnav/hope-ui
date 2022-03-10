import { mergeProps, Show, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";

import { useComponentStyleConfigs } from "@/theme/provider";
import { classNames, createClassSelector } from "@/utils/css";

import { Box } from "../box/box";
import { createModal } from "../modal/create-modal";
import { ElementType, HTMLHopeProps } from "../types";
import { useDrawerContext } from "./drawer";
import { drawerContainerStyles, drawerDialogStyles, drawerTransitionName } from "./drawer.styles";

export type DrawerPanelProps<C extends ElementType = "section"> = HTMLHopeProps<C>;

const hopeDrawerContainerClass = "hope-drawer__panel-container";
const hopeDrawerPanelClass = "hope-drawer__panel";

/**
 * Container for the drawer dialog's content.
 */
export function DrawerPanel<C extends ElementType = "section">(props: DrawerPanelProps<C>) {
  const theme = useComponentStyleConfigs().Drawer;

  const drawerContext = useDrawerContext();

  const defaultProps: DrawerPanelProps<"section"> = {
    as: "section",
  };

  const propsWithDefault: DrawerPanelProps<"section"> = mergeProps(defaultProps, props);
  const [local, others] = splitProps(propsWithDefault, [
    "ref",
    "class",
    "role",
    "aria-labelledby",
    "aria-describedby",
    "onClick",
  ]);

  const {
    modalContext,
    assignContainerRef,
    ariaLabelledBy,
    ariaDescribedBy,
    onDialogClick,
    enableFocusTrapAndScrollLock,
    disableFocusTrapAndScrollLock,
  } = createModal(local);

  const containerClasses = () => {
    return classNames(
      hopeDrawerContainerClass,
      drawerContainerStyles({
        placement: drawerContext.placement,
      })
    );
  };

  const dialogClasses = () => {
    const dialogClass = drawerDialogStyles({
      size: drawerContext.size,
      placement: drawerContext.placement,
      fullHeight: drawerContext.fullHeight,
    });

    return classNames(local.class, hopeDrawerPanelClass, dialogClass);
  };

  const transitionName = () => {
    if (drawerContext.disableMotion) {
      return "hope-none";
    }

    switch (drawerContext.placement) {
      case "top":
        return drawerTransitionName.slideInTop;
      case "right":
        return drawerTransitionName.slideInRight;
      case "bottom":
        return drawerTransitionName.slideInBottom;
      case "left":
        return drawerTransitionName.slideInLeft;
    }
  };

  return (
    <Transition
      name={transitionName()}
      appear
      onAfterEnter={enableFocusTrapAndScrollLock}
      onBeforeExit={disableFocusTrapAndScrollLock}
      onAfterExit={modalContext.onModalPanelExitTransitionEnd}
    >
      <Show when={modalContext.state.opened}>
        <Box
          ref={assignContainerRef}
          class={containerClasses()}
          tabIndex={-1}
          onMouseDown={modalContext.onMouseDown}
          onKeyDown={modalContext.onKeyDown}
          onClick={modalContext.onOverlayClick}
        >
          <Box
            class={dialogClasses()}
            __baseStyle={theme?.baseStyle?.panel}
            id={modalContext.state.dialogId}
            role={local.role ?? "dialog"}
            tabIndex={-1}
            aria-modal={true}
            aria-labelledby={ariaLabelledBy()}
            aria-describedby={ariaDescribedBy()}
            onClick={onDialogClick}
            {...others}
          />
        </Box>
      </Show>
    </Transition>
  );
}

DrawerPanel.toString = () => createClassSelector(hopeDrawerPanelClass);