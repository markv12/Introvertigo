using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LoadingScreen : MonoBehaviour {
    public Image mainImage;

    public static LoadingScreen instance;

    private const string LOADING_SCREEN_PATH = "LoadingScreen";
    public static void LoadScene(string sceneName) {
        if (instance == null) {
            LoadingScreen loadingScreenObject = Resources.Load<LoadingScreen>(LOADING_SCREEN_PATH);
            instance = Instantiate(loadingScreenObject);
            DontDestroyOnLoad(instance);
        }
        instance.FadeLoadScene(sceneName);
    }

    private Coroutine loadRoutine = null;
    private void FadeLoadScene(string sceneName) {
        if (loadRoutine != null) {
            Debug.LogError("Tried loading while load already in progress");
        } else {
            loadRoutine = StartCoroutine(_FadeLoadScene(sceneName));
        }
    }

    private const float FADE_TIME = 0.75f;
    private static readonly WaitForSeconds middleWait = new WaitForSeconds(0.75f);
    private IEnumerator _FadeLoadScene(string sceneName) {
        AudioManager.Instance.FadeOutBGAudio();
        AsyncOperation async = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Single);
        async.allowSceneActivation = false;

        mainImage.enabled = true;
        mainImage.color = Color.black.SetA(mainImage.color.a);
        Color startColor = mainImage.color;
        Color endColor = mainImage.color.SetA(1);
        float progress = 0;
        float elapsedTime = 0;
        while (progress <= 1) {
            elapsedTime += Time.deltaTime;
            progress = elapsedTime / FADE_TIME;
            mainImage.color = Color.Lerp(startColor, endColor, Easing.easeInOutSine(0, 1, progress));
            yield return null;
        }
        mainImage.color = endColor;

        yield return null;
        async.allowSceneActivation = true;
        yield return null;
        yield return middleWait;

        startColor = mainImage.color;
        endColor = mainImage.color.SetA(0);
        progress = 0;
        elapsedTime = 0;
        while (progress <= 1) {
            elapsedTime += Time.deltaTime;
            progress = elapsedTime / FADE_TIME;
            mainImage.color = Color.Lerp(startColor, endColor, Easing.easeInOutSine(0, 1, progress));
            yield return null;
        }
        mainImage.color = endColor;
        mainImage.enabled = false;
        loadRoutine = null;
    }
}
