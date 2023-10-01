using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;
using System.Text;

public class DialogueSystem : MonoBehaviour {
    public string sceneKey;
    public SceneAnimator sceneAnimator;

    public TMP_InputField mainInputField;
    public RectTransform enemyDialogueBG;
    public TMP_Text enemyDialogue;
    public RectTransform whatYouSaidBG;
    public TMP_Text whatYouSaidText;
    public TMP_Text requiredWordsText;
    public Button enterButton;
    public GameObject backstoryBG;
    public TMP_Text backstoryText;
    public Button backstoryBeginButton;
    private DialogueVertexAnimator dvaEnemy;
    private DialogueVertexAnimator dvaWhatYouSaid;

    private readonly List<string> currentRequiredWords = new List<string>(8);
    private void Awake() {
        dvaEnemy = new DialogueVertexAnimator(enemyDialogue, null, PlayEnemyTalkSound);
        dvaWhatYouSaid = new DialogueVertexAnimator(whatYouSaidText, null, PlayPlayerTalkSound);
        enterButton.onClick.AddListener(Enter);
        backstoryBeginButton.onClick.AddListener(BackstoryBegin);
        GameRequestManager.Instance.GetGameScenario(sceneKey, () => {
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
        FieldCleaner.Attach(mainInputField);
    }

    private bool hasRequiredWord = false;
    private void InputValueChanged(string newText) {
        hasRequiredWord = HasRequiredWord(newText, out string indicatorText);
        int wordCount = DialogueUtility.WordCount(newText);
        enterButton.gameObject.SetActive(wordCount >= 5 && hasRequiredWord);
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
            builder.Append("<color=#b7bfff99>Must use one:</color>  ");
            for (int i = 0; i < currentRequiredWords.Count; i++) {
                string word = currentRequiredWords[i];
                bool wordUsed = !hasRequiredWord && matchValue.Contains(word.ToLower());
                if (wordUsed) { hasRequiredWord = true; }
                builder.Append("<color=" + (wordUsed ? "#fffeb9" : "#b7bfff") + ">");
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
                    break;
                }
            }
            mainInputField.text = "";
            StartCoroutine(SayRoutine());
            GameRequestManager.Instance.SubmitNextMessage(inputText, (GPTResponse rr) => {
                StartCoroutine(ResponseRoutine(rr));
            });
        }

        IEnumerator SayRoutine() {
            whatYouSaidText.text = inputText;
            whatYouSaidText.ForceMeshUpdate();
            whatYouSaidBG.sizeDelta = whatYouSaidBG.sizeDelta.SetX(whatYouSaidText.preferredWidth + 50);
            whatYouSaidBG.gameObject.SetActive(true);
            whatYouSaidText.text = "";
            List<DialogueCommand> commands = DialogueUtility.ProcessInputString(inputText, out string processedMessage);
            IEnumerator subRoutine = dvaWhatYouSaid.AnimateTextIn(commands, processedMessage, 1, () => { dialogueFinished = true; stopTime = Time.time + 1f; });
            while (subRoutine.MoveNext() && (!dialogueFinished || Time.time < stopTime)) yield return subRoutine.Current;
        }

        IEnumerator ResponseRoutine(GPTResponse gptResponse) {
            while (!dialogueFinished || Time.time < stopTime) {
                yield return null;
            }
            sceneAnimator.HandleResponse(gptResponse);
            EnemyTalk(gptResponse.reply);
        }
    }

    private Coroutine enemyTalkRoutine;
    private void EnemyTalk(string message) {
        enemyDialogueBG.gameObject.SetActive(true);
        enemyDialogue.text = message;
        enemyDialogue.ForceMeshUpdate();
        enemyDialogueBG.sizeDelta = enemyDialogueBG.sizeDelta.SetY(enemyDialogue.renderedHeight + 80);
        enemyDialogue.text = "";
        this.EnsureCoroutineStopped(ref enemyTalkRoutine);
        List<DialogueCommand> commands = DialogueUtility.ProcessInputString(message, out string processedMessage);
        enemyTalkRoutine = StartCoroutine(dvaEnemy.AnimateTextIn(commands, processedMessage, 1, null));
    }

    private void PlayPlayerTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayPlayerTalkSound(1.0f, pitchCenter);
    }

    private void PlayEnemyTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayRandomPitchSound(sceneAnimator.enemyTalkClip, 1.0f, pitchCenter, sceneAnimator.enemyPitchVariation);
    }
}
