using UnityEngine;
using UnityEngine.UI;

public class EndScreen : MonoBehaviour {
    public Button restartButton;

    private void Awake() {
        restartButton.onClick.AddListener(Restart);
    }

    private bool restarted = false;
    private void Restart() {
        if (!restarted) {
            restarted = true;
            LoadingScreen.LoadScene("StartScreen");
        }
    }
}
