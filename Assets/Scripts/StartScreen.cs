using UnityEngine;
using UnityEngine.UI;

public class StartScreen : MonoBehaviour {
    public Button startButton;

    private void Awake() {
        startButton.onClick.AddListener(StartGame);
    }

    private bool started = false;
    private void StartGame() {
        if (!started) {
            started = true;
            GameFlowManager.StartGame();
        }
    }
}
