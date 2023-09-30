using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.Controls;

public class InputUtil : MonoBehaviour {
    public static float GetHorizontal() {
        float result = 0;
        Keyboard kb = Keyboard.current;
        if (kb.aKey.isPressed || kb.leftArrowKey.isPressed) {
            result -= 1;
        }
        if (kb.dKey.isPressed || kb.rightArrowKey.isPressed) {
            result += 1;
        }
        return result;
    }

    public static float GetVertical() {
        float result = 0;
        Keyboard kb = Keyboard.current;
        if (kb.sKey.isPressed || kb.downArrowKey.isPressed) {
            result -= 1;
        }
        if (kb.wKey.isPressed || kb.upArrowKey.isPressed) {
            result += 1;
        }
        return result;
    }

    public static bool GetKeyDown(Key key) {
        return Keyboard.current[key].wasPressedThisFrame;
    }

    public static bool GetKey(Key key) {
        return Keyboard.current[key].isPressed;
    }

    public static bool GetKeyUp(Key key) {
        return Keyboard.current[key].wasReleasedThisFrame;
    }

    public static float MouseScrollDelta => Mouse.current.scroll.ReadValue().y;

    public static Vector2 MousePosition {
        get {
            if (Pen.current != null && Pen.current.inRange.ReadValue() > 0.5f) {
                return Pen.current.position.ReadValue();
            } else if (HasMobileTouch) {
                if (Touchscreen.current != null) {
                    for (int i = 0; i < Touchscreen.current.touches.Count; i++) {
                        TouchControl touch = Touchscreen.current.touches[i];
                        if (touch.press.isPressed) {
                            return touch.position.ReadValue();
                        }
                    }
                }
                return Vector2.zero;
            } else {
                return Mouse.current.position.ReadValue();
            }
        }
    }

    public static bool LeftMouseButtonDown => buttonDownFrame == Time.frameCount;
    public static bool LeftMouseButtonUp => buttonUpFrame == Time.frameCount;
    public static bool LeftMouseButtonIsPressed {
        get {
            return Mouse.current.leftButton.isPressed || HasMobileTouch;
        }
    }
    public static bool RightMouseButtonDown => Mouse.current.rightButton.wasPressedThisFrame;
    private static bool HasMobileTouch {
        get {
            if (IsMobile) {
                if (Touchscreen.current != null) {
                    for (int i = 0; i < Touchscreen.current.touches.Count; i++) {
                        TouchControl touch = Touchscreen.current.touches[i];
                        if (touch.press.isPressed) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }

    private static int buttonDownFrame;
    private static int buttonUpFrame;
    private static bool prevIsPressed;

    private void Update() {
        bool isPressed = LeftMouseButtonIsPressed;
        if (isPressed && !prevIsPressed) {
            buttonDownFrame = Time.frameCount;
        } else if (!isPressed && prevIsPressed) {
            buttonUpFrame = Time.frameCount;
        }
        prevIsPressed = isPressed;
    }

    public static bool SelectPressed() {
        return GetKeyDown(Key.E) || GetKeyDown(Key.Space);
    }
    public static bool CTRLPressed => GetKey(Key.LeftCtrl) || GetKey(Key.RightCtrl) || GetKey(Key.LeftCommand) || GetKey(Key.RightCommand);
    public static bool ShiftPressed => GetKey(Key.LeftShift) || GetKey(Key.RightShift);
    public static bool AltPressed => GetKey(Key.LeftAlt) || GetKey(Key.LeftAlt);

    public static bool ScrollWheelUp => MouseScrollDelta < -0.001f || GetKeyDown(Key.LeftBracket);
    public static bool ScrollWheelDown => MouseScrollDelta > 0.001f || GetKeyDown(Key.RightBracket);

    public static bool IsMobile => UnityEngine.Device.Application.isMobilePlatform;
}
