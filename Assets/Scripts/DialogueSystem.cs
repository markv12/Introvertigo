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
    }

    private Coroutine typeRoutine;
    private void Enter() {
        this.EnsureCoroutineStopped(ref typeRoutine);
        typeRoutine = StartCoroutine(EnterRoutine());

        IEnumerator EnterRoutine() {
            string inputText = mainInputField.text;
            mainInputField.text = "";

            bool dialogueFinished = false;
            float stopTime = 0;
            List<DialogueCommand> commands = DialogueUtility.ProcessInputString(inputText, out string processedMessage);
            IEnumerator subRoutine = dvaWhatYouSaid.AnimateTextIn(commands, processedMessage, 1, () => { dialogueFinished = true; stopTime = Time.time + 1f; });
            while (subRoutine.MoveNext() && (!dialogueFinished || Time.time < stopTime)) yield return subRoutine.Current;

            commands = DialogueUtility.ProcessInputString(inputText, out processedMessage);
            subRoutine = dvaOutput.AnimateTextIn(commands, processedMessage, 1, null);
            while (subRoutine.MoveNext()) yield return subRoutine.Current;
        }
    }

    private void PlayTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayTalkSound(1.0f, pitchCenter);
    }
}
