using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;

public class DialogueSystem : MonoBehaviour {
    public TMP_InputField mainInputField;
    public TMP_Text outputDialogue;
    public TMP_Text whatYouSaidText;
    public Button enterButton;
    public GameObject backstoryBG;
    public TMP_Text backstoryText;
    public Button backstoryBeginButton;
    private DialogueVertexAnimator dvaOutput;
    private DialogueVertexAnimator dvaWhatYouSaid;

    private string firstMessage;
    private void Awake() {
        dvaOutput = new DialogueVertexAnimator(outputDialogue, null, PlayTalkSound);
        dvaWhatYouSaid = new DialogueVertexAnimator(whatYouSaidText, null, PlayTalkSound);
        enterButton.onClick.AddListener(Enter);
        backstoryBeginButton.onClick.AddListener(() => { backstoryBG.SetActive(false); EnemyTalk(firstMessage); });
        GameRequestManager.Instance.GetGameScenario((GameScenario gameScenario) => {
            if(gameScenario != null) {
                backstoryText.text = gameScenario.backstory;
                backstoryBeginButton.gameObject.SetActive(true);
                if(gameScenario.messages.Length > 0) {
                    firstMessage = gameScenario.messages[gameScenario.messages.Length - 1].content;
                }
            }
        });
    }

    private void Enter() {
        bool dialogueFinished = false;
        float stopTime = 0;

        string inputText = mainInputField.text.Trim();
        if(!string.IsNullOrWhiteSpace(inputText) && inputText.Length <= 100) {
            mainInputField.text = "";
            StartCoroutine(SayRoutine());
            GameRequestManager.Instance.SubmitNextMessage(inputText, (RequestResponse rr) => {
                StartCoroutine(ResponseRoutine(rr));
            });
        }

        IEnumerator SayRoutine() {
            List<DialogueCommand> commands = DialogueUtility.ProcessInputString(inputText, out string processedMessage);
            IEnumerator subRoutine = dvaWhatYouSaid.AnimateTextIn(commands, processedMessage, 1, () => { dialogueFinished = true; stopTime = Time.time + 1f; });
            while (subRoutine.MoveNext() && (!dialogueFinished || Time.time < stopTime)) yield return subRoutine.Current;
        }

        IEnumerator ResponseRoutine(RequestResponse rr) {
            while (!dialogueFinished || Time.time < stopTime) {
                yield return null;
            }
            EnemyTalk(rr.reply);
        }
    }

    private Coroutine enemyTalkRoutine;
    private void EnemyTalk(string message) {
        this.EnsureCoroutineStopped(ref enemyTalkRoutine);
        List<DialogueCommand> commands = DialogueUtility.ProcessInputString(message, out string processedMessage);
        enemyTalkRoutine = StartCoroutine(dvaOutput.AnimateTextIn(commands, processedMessage, 1, null));
    }

    private void PlayTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayTalkSound(1.0f, pitchCenter);
    }
}
