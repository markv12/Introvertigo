using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;
using System.Text;

public class DialogueSystem : MonoBehaviour {
    public string sceneKey;
    public SceneAnimator sceneAnimator;

    public GameObject textEntryUI;
    public TMP_InputField mainInputField;
    public RectTransform enemyDialogueBG;
    public TMP_Text enemyDialogue;
    public RectTransform whatYouSaidBG;
    public TMP_Text whatYouSaidText;
    public TMP_Text requiredWordsText;
    public Button enterButton;
    public GameObject backstoryBG;
    public TMP_Text backstoryText;
    public Image backstoryEnemyPog;
    public Button backstoryBeginButton;
    public GameObject shortWarning;
    public GameObject missingRequiredWarning;
    public ScenarioEndScreen endScreen;

    private DialogueVertexAnimator dvaEnemy;
    private DialogueVertexAnimator dvaWhatYouSaid;
    private readonly List<string> allRequiredWords = new List<string>(18);
    private string[] currentRequiredWords;
    private int totalMessagesUsed = 0;

    private void Awake() {
        textEntryUI.SetActive(false);
        dvaEnemy = new DialogueVertexAnimator(enemyDialogue, null, PlayEnemyTalkSound);
        dvaWhatYouSaid = new DialogueVertexAnimator(whatYouSaidText, null, PlayPlayerTalkSound);
        enterButton.onClick.AddListener(Enter);
        backstoryBeginButton.onClick.AddListener(BackstoryBegin);
        backstoryEnemyPog.sprite = sceneAnimator.enemyPog;
        GameRequestManager.Instance.GetGameScenario(sceneKey, () => {
            GameScenario gameScenario = GameRequestManager.CurrentScenario;
            if (gameScenario != null) {
                allRequiredWords.Clear();
                allRequiredWords.AddRange(gameScenario.requiredWords);
                currentRequiredWords = allRequiredWords.RandomSubset(5);
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
        bool wordCountLongEnough = DialogueUtility.WordCount(newText) >= 5;
        enterButton.gameObject.SetActive(wordCountLongEnough && hasRequiredWord);
        requiredWordsText.text = indicatorText;
        shortWarning.SetActive(!string.IsNullOrEmpty(newText) && !wordCountLongEnough);
        missingRequiredWarning.SetActive(!string.IsNullOrEmpty(newText) && !hasRequiredWord);
    }

    private static readonly StringBuilder builder = new StringBuilder();
    private bool HasRequiredWord(string value, out string indicatorText) {
        if (currentRequiredWords.Length == 0) {
            indicatorText = "";
            return true;
        } else {
            bool hasRequiredWord = false;
            builder.Clear();
            string matchValue = value.ToLower();
            builder.Append("<color=#b7bfff99>Must use one:</color>  ");
            for (int i = 0; i < currentRequiredWords.Length; i++) {
                string word = currentRequiredWords[i];
                bool wordUsed = !hasRequiredWord && matchValue.Contains(word.ToLower());
                if (wordUsed) { hasRequiredWord = true; }
                builder.Append("<color=" + (wordUsed ? "#fffeb9" : "#b7bfff") + ">");
                builder.Append(word);
                builder.Append("</color>");
                if (i < currentRequiredWords.Length - 1) {
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
        if (mainInputField.gameObject.activeInHierarchy && !mainInputField.isFocused) {
            StartCoroutine(ActivateTextField());
        }
    }

    IEnumerator ActivateTextField() {
        mainInputField.ActivateInputField();
        yield return null;
        mainInputField.MoveTextEnd(false);
    }

    private bool backstoryBegan = false;
    private void BackstoryBegin() {
        if (!backstoryBegan) {
            backstoryBegan = true;
            backstoryBG.SetActive(false);
            textEntryUI.SetActive(true);
            GameMessage[] messages = GameRequestManager.CurrentScenario.messages;
            if (messages.Length > 0) {
                EnemyTalk(messages[messages.Length - 1].content);
            }
        }
    }

    private bool enterDisabled = false;
    private void Enter() {
        bool dialogueFinished = false;
        float stopTime = 0;
        if (!enterDisabled) {
            enterDisabled = true;
            string inputText = mainInputField.text.Trim();
            if (!string.IsNullOrWhiteSpace(inputText) && inputText.Length <= 100) {
                for (int i = 0; i < allRequiredWords.Count; i++) {
                    if (inputText.ToLower().Contains(allRequiredWords[i].ToLower())) {
                        allRequiredWords.RemoveAt(i);
                        break;
                    }
                }
                currentRequiredWords = allRequiredWords.RandomSubset(5);
                mainInputField.text = "";
                totalMessagesUsed++;
                StartCoroutine(SayRoutine(inputText));
                GameRequestManager.Instance.SubmitNextMessage(inputText, (GPTResponse rr) => {
                    StartCoroutine(ResponseRoutine(rr));
                });
            }
        }


        IEnumerator SayRoutine(string inputText) {
            whatYouSaidText.text = inputText;
            whatYouSaidText.ForceMeshUpdate();
            whatYouSaidBG.sizeDelta = whatYouSaidBG.sizeDelta.SetX(whatYouSaidText.preferredWidth + 70);
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
            EndType endType = sceneAnimator.HandleResponse(gptResponse);
            if (endType == EndType.none) {
                //endScreen.ShowEnd(sceneAnimator.EndSprite(EndType.bad), GameRequestManager.CurrentScenario.EndText(EndType.bad), true);
                EnemyTalk(gptResponse.reply);
            } else {
                GameFlowManager.RecordSceneResult(SceneHelper.CurrentScene, endType, totalMessagesUsed);
                endScreen.ShowEnd(sceneAnimator.EndSprite(endType), GameRequestManager.CurrentScenario.EndText(endType), endType);
                AudioManager.Instance.StopHeartBeat();
            }
        }
    }

    private Coroutine enemyTalkRoutine;
    private void EnemyTalk(string message) {
        enterDisabled = true;
        enemyDialogueBG.gameObject.SetActive(true);
        enemyDialogue.text = message;
        enemyDialogue.ForceMeshUpdate();
        enemyDialogueBG.sizeDelta = enemyDialogueBG.sizeDelta.SetY(enemyDialogue.renderedHeight + 100);
        enemyDialogue.text = "";
        this.EnsureCoroutineStopped(ref enemyTalkRoutine);
        List<DialogueCommand> commands = DialogueUtility.ProcessInputString(message, out string processedMessage);
        enemyTalkRoutine = StartCoroutine(dvaEnemy.AnimateTextIn(commands, processedMessage, 1, () => { enterDisabled = false; }));
    }

    private void PlayPlayerTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayPlayerTalkSound(1.0f, pitchCenter);
    }

    private void PlayEnemyTalkSound(float pitchCenter) {
        AudioManager.Instance.PlayRandomPitchSound(sceneAnimator.enemyTalkClip, sceneAnimator.enemyTalkVolume, pitchCenter, sceneAnimator.enemyPitchVariation);
    }
}
