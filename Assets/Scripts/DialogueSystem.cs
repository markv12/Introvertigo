using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;
using System.Text;

public class DialogueSystem : MonoBehaviour {
    public TMP_InputField mainInputField;
    public TMP_Text outputDialogue;
    public TMP_Text whatYouSaidText;
    public TMP_Text requiredWordsText;
    public Button enterButton;
    public GameObject backstoryBG;
    public TMP_Text backstoryText;
    public Button backstoryBeginButton;
    private DialogueVertexAnimator dvaOutput;
    private DialogueVertexAnimator dvaWhatYouSaid;

    private readonly List<string> currentRequiredWords = new List<string>(8);
    private void Awake() {
        dvaOutput = new DialogueVertexAnimator(outputDialogue, null, PlayTalkSound);
        dvaWhatYouSaid = new DialogueVertexAnimator(whatYouSaidText, null, PlayTalkSound);
        enterButton.onClick.AddListener(Enter);
        backstoryBeginButton.onClick.AddListener(BackstoryBegin);
        GameRequestManager.Instance.GetGameScenario(() => {
            GameScenario gameScenario = GameRequestManager.CurrentScenario;
            if(gameScenario != null) {
                currentRequiredWords.Clear();
                currentRequiredWords.AddRange(gameScenario.requiredWords);
                backstoryText.text = gameScenario.backstory;
                backstoryBeginButton.gameObject.SetActive(true);
                InputValueChanged("");
            }
        });

        mainInputField.onValueChanged.AddListener(InputValueChanged);
    }

    private bool hasRequiredWord = false;
    private void InputValueChanged(string value) {
        hasRequiredWord = HasRequiredWord(value, out string indicatorText);
        enterButton.gameObject.SetActive(hasRequiredWord);
        requiredWordsText.text = indicatorText;
    }

    private static readonly StringBuilder builder = new StringBuilder();
    private bool HasRequiredWord(string value, out string indicatorText) {
        if(currentRequiredWords.Count == 0) {
            indicatorText = "";
            return true;
        } else {
            bool hasRequiredWord = false;
            builder.Clear();
            string matchValue = value.ToLower();
            builder.Append("Use at least one of these words:  ");
            for (int i = 0; i < currentRequiredWords.Count; i++) {
                string word = currentRequiredWords[i];
                bool wordUsed = matchValue.Contains(word.ToLower());
                if (wordUsed) { hasRequiredWord = true; }
                builder.Append("<color=" + (wordUsed ? "green" : "black") + ">");
                builder.Append(word);
                builder.Append("</color>");
                if (i < currentRequiredWords.Count - 1) {
                    builder.Append(",  ");
                }
            }
            indicatorText = builder.ToString();
            return hasRequiredWord;
        }
    }

    private void Update() {
        if (InputUtil.GetKeyDown(UnityEngine.InputSystem.Key.Enter) && hasRequiredWord) {
            Enter();
        }
    }

    private void BackstoryBegin() {
        backstoryBG.SetActive(false);
        GameMessage[] messages = GameRequestManager.CurrentScenario.messages;
        if (messages.Length > 0) {
            EnemyTalk(messages[messages.Length - 1].content);
        }
    }

    private void Enter() {
        bool dialogueFinished = false;
        float stopTime = 0;

        string inputText = mainInputField.text.Trim();
        if(!string.IsNullOrWhiteSpace(inputText) && inputText.Length <= 100) {
            for (int i = 0; i < currentRequiredWords.Count; i++) {
                if (inputText.ToLower().Contains(currentRequiredWords[i].ToLower())){
                    currentRequiredWords.RemoveAt(i);
                    i--;
                }
            }
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
