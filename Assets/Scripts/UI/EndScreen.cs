using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class EndScreen : MonoBehaviour {
    public Button restartButton;
    public EndScreenPog[] pogs;
    public TMP_Text resultLabel;
    public Image endPC;
    public Sprite badPCSprite;
    public Sprite okPCSprite;
    public Sprite goodPCSprite;

    private void Awake() {
        restartButton.onClick.AddListener(Restart);

        int totalMessages = 0;
        int totalGood = 0;

        for (int i = 0; i < pogs.Length; i++) {
            EndScreenPog pog = pogs[i];
            if(i < GameFlowManager.gameResults.Count) {
                GameResult gr = GameFlowManager.gameResults[i];
                totalMessages += gr.messageTotal;
                pog.ShowResult(gr);
                if(gr.endType == EndType.good) {
                    totalGood++;
                }
            } else {
                pog.gameObject.SetActive(false);
            }
        }

        SetSpriteForGoodCount(totalGood);

        float totalTime = Time.time - GameFlowManager.startTime;
        int totalMinutes = Mathf.RoundToInt(totalTime / 60f);
        string totalSeconds = Mathf.RoundToInt(totalTime % 60f).ToString();
        if(totalSeconds.Length == 1) { totalSeconds = "0" + totalSeconds; }
        resultLabel.text = "Time: " + totalMinutes + ":" + totalSeconds + Environment.NewLine + "Messages: " + totalMessages;
    }

    private void SetSpriteForGoodCount(int totalGood) {
        if(totalGood <= 1) {
            endPC.sprite = badPCSprite;
        } else if(totalGood < 4) {
            endPC.sprite = okPCSprite;
        } else {
            endPC.sprite = goodPCSprite;
        }
    }

    private bool restarted = false;
    private void Restart() {
        if (!restarted) {
            restarted = true;
            LoadingScreen.LoadScene(Scenes.START_SCREEN.Name());
        }
    }
}
