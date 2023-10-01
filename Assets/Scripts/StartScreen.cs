using UnityEngine;
using UnityEngine.UI;

public class StartScreen : MonoBehaviour
{
    public Button startButton;
    public Button closeButton;

    public GameObject howToPlayElement;

    private void Awake()
    {
        startButton.onClick.AddListener(StartGame);
    }

    private bool started = false;
    private void StartGame()
    {
        if (!started)
        {
            started = true;
            GameFlowManager.StartGame();
        }
    }

    public void ShowHowToPlay()
    {
        howToPlayElement.gameObject.SetActive(true);
        closeButton.gameObject.SetActive(false);
    }

    public void HideHowToPlay()
    {
        howToPlayElement.gameObject.SetActive(false);
        closeButton.gameObject.SetActive(true);
    }

}
