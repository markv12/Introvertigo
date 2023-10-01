using TMPro;
using System.Text.RegularExpressions;

public static class FieldCleaner {
    public static void Attach(TMP_InputField _inputField) {
        _inputField.onValueChanged.AddListener((string attemptedVal) => {
            _inputField.text = CleanInput(attemptedVal);
        });
    }

    private static string CleanInput(string strIn) {
        return Regex.Replace(strIn, @"[^a-zA-Z0-9!@_+\-.',? ]", "");
    }
}
