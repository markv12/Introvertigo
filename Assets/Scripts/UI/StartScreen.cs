using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class StartScreen : MonoBehaviour {
    public Button startButton;
    public Button closeButton;
    public TMP_InputField passwordField;
    public static string password = "";

    public GameObject howToPlayElement;

    private void Awake() {
        startButton.onClick.AddListener(StartGame);
        passwordField.onValueChanged.AddListener(PasswordChanged);
    }

    private void PasswordChanged(string passwordText) {
        password = passwordText;
    }

    private bool started = false;
    private void StartGame() {
        if (!started) {
            started = true;
            GameFlowManager.StartGame();
        }
    }

    public void ShowHowToPlay() {
        howToPlayElement.SetActive(true);
        if (closeButton != null) {
            closeButton.gameObject.SetActive(false);
        }
    }

    public void HideHowToPlay() {
        howToPlayElement.SetActive(false);
        if (closeButton != null) {
            closeButton.gameObject.SetActive(true);
        }
    }
}
