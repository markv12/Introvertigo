using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class EndScreen : MonoBehaviour {
    public RectTransform mainT;
    public CanvasGroup mainGroup;
    public Image mainImage;
    public TMP_Text mainText;
    public Button forwardButton;

    private void Awake() {
        forwardButton.onClick.AddListener(() => {
            LoadingScreen.LoadScene("UrinalScene");
        });
    }

    public void ShowEnd(Sprite image, string text) {
        StartCoroutine(EndRoutine());

        IEnumerator EndRoutine() {
            mainImage.sprite = image;
            mainText.text = text;
            mainGroup.alpha = 0;
            mainGroup.gameObject.SetActive(true);
            yield return this.CreateAnimationRoutine(1.2f, (float progress) => {
                mainGroup.alpha = Mathf.Lerp(0, 1, progress);
            });
            yield return WaitUtil.GetWait(0.333f);
            forwardButton.gameObject.SetActive(true);
        }
    }
}
