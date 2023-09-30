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
    private DialogueVertexAnimator dvaOutput;
    private DialogueVertexAnimator dvaWhatYouSaid;

    private void Awake() {
        dvaOutput = new DialogueVertexAnimator(outputDialogue, null, PlayTalkSound);
        dvaWhatYouSaid = new DialogueVertexAnimator(whatYouSaidText, null, PlayTalkSound);
        enterButton.onClick.AddListener(Enter);
        GameRequestManager.Instance.GetGameScenario((GameScenario gameScenario) => {
            if(gameScenario != null) {
                outputDialogue.text = gameScenario.backstory;
            }
        });
    }

    private Coroutine typeRoutine;
    private void Enter() {
        bool dialogueFinished = false;
        float stopTime = 0;
        this.EnsureCoroutineStopped(ref typeRoutine);

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
            dialogueFinished = false;
            List<DialogueCommand> commands = DialogueUtility.ProcessInputString(rr.reply, out string processedMessage);
            IEnumerator subRoutine = dvaOutput.AnimateTextIn(commands, processedMessage, 1, () => { dialogueFinished = true; stopTime = Time.time + 1f; });
            while (subRoutine.MoveNext() && (!dialogueFinished || Time.time < stopTime)) yield return subRoutine.Current;
        }
    }

    private void PlayTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayTalkSound(1.0f, pitchCenter);
    }
}
