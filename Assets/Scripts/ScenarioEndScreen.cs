using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ScenarioEndScreen : MonoBehaviour {
    public RectTransform mainT;
    public CanvasGroup mainGroup;
    public Image mainImage;
    public TMP_Text mainText;
    public RectTransform mainTextBox;
    public Button forwardButton;
    public GameObject rudeImage;

    private bool ended = false;
    private void Awake() {
        forwardButton.onClick.AddListener(() => {
            if (!ended) {
                ended = true;
                GameFlowManager.NextScene();
            }
        });
    }

    public void ShowEnd(Sprite image, string text, bool rude) {
        StartCoroutine(EndRoutine());

        IEnumerator EndRoutine() {
            rudeImage.SetActive(rude);
            mainImage.sprite = image;

            mainGroup.alpha = 0;
            mainGroup.gameObject.SetActive(true);

            mainText.text = "\"" + text + "\"";
            mainText.ForceMeshUpdate();
            mainTextBox.sizeDelta = mainTextBox.sizeDelta.SetY(mainText.renderedHeight + 70);

            yield return this.CreateAnimationRoutine(1.2f, (float progress) => {
                mainGroup.alpha = Mathf.Lerp(0, 1, progress);
            });
            yield return WaitUtil.GetWait(0.333f);
            forwardButton.gameObject.SetActive(true);
        }
    }
}
