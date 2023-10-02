using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class EndScreen : MonoBehaviour {
    public Button restartButton;
    public EndScreenPog[] pogs;
    public TMP_Text resultLabel;
    private void Awake() {
        restartButton.onClick.AddListener(Restart);

        int totalMessages = 0;

        for (int i = 0; i < pogs.Length; i++) {
            EndScreenPog pog = pogs[i];
            if(i < GameFlowManager.gameResults.Count) {
                GameResult gr = GameFlowManager.gameResults[i];
                totalMessages += gr.messageTotal;
                pog.ShowResult(gr);
            } else {
                pog.gameObject.SetActive(false);
            }
        }
        float totalTime = Time.time - GameFlowManager.startTime;
        int totalMinutes = Mathf.RoundToInt(totalTime / 60f);
        int totalSeconds = Mathf.RoundToInt(totalTime % 60f);
        resultLabel.text = "Time: " + totalMinutes + ":" + totalSeconds + Environment.NewLine + "Messages: " + totalMessages;
    }

    private bool restarted = false;
    private void Restart() {
        if (!restarted) {
            restarted = true;
            LoadingScreen.LoadScene(Scenes.START_SCREEN.Name());
        }
    }
}
